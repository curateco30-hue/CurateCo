"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations/checkout";
import { notifyNewOrder, notifyOrderConfirmation, notifyLowStock } from "@/lib/actions/notify";

const LOW_STOCK_THRESHOLD = 5;

interface CheckoutItemInput {
  productId: string;
  size: string;
  color: string;
  quantity: number;
}

interface CheckoutRequest extends CheckoutInput {
  storeSlug: string;
  items: CheckoutItemInput[];
}

export async function createOrder(request: CheckoutRequest) {
  const parsed = checkoutSchema.safeParse(request);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid checkout details.");
  }
  if (request.items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const service = createServiceClient();

  const { data: store } = await service
    .from("curator_stores")
    .select("id, curator_id")
    .eq("store_slug", request.storeSlug)
    .eq("is_active", true)
    .single();
  if (!store) throw new Error("This store is no longer available.");

  // Never trust client-supplied prices — re-derive everything server-side
  // from the current product + commission records.
  const productIds = [...new Set(request.items.map((i) => i.productId))];
  const { data: storeProducts } = await service
    .from("curator_store_products")
    .select("id, product_id, curator_commission_pct, products(name, brand_id, base_price, curateco_commission_pct, selling_price, stock)")
    .eq("store_id", store.id)
    .in("product_id", productIds);

  if (!storeProducts || storeProducts.length !== productIds.length) {
    throw new Error("One or more items are no longer available in this store.");
  }

  interface ResolvedItem extends CheckoutItemInput {
    storeProductId: string;
    brandId: string;
    productName: string;
    unitPrice: number;
    curatorCommissionPct: number;
    curatecoCommissionAmount: number;
    curatorCommissionAmount: number;
    basePrice: number;
    remainingStock: number;
  }

  const resolved: ResolvedItem[] = request.items.map((item) => {
    const sp = storeProducts.find((s) => s.product_id === item.productId);
    const product = sp?.products as unknown as {
      name: string;
      brand_id: string;
      base_price: number;
      curateco_commission_pct: number;
      selling_price: number;
      stock: number;
    } | null;
    if (!sp || !product) throw new Error("A product in your cart could not be found.");
    if (product.stock < item.quantity) {
      throw new Error("One or more items no longer have enough stock.");
    }

    const curatecoAmountPerUnit = product.selling_price - product.base_price;
    const curatorAmountPerUnit = product.selling_price * (sp.curator_commission_pct / 100);
    const unitPrice = product.selling_price + curatorAmountPerUnit;

    return {
      ...item,
      storeProductId: sp.id,
      brandId: product.brand_id,
      productName: product.name,
      unitPrice,
      curatorCommissionPct: sp.curator_commission_pct,
      curatecoCommissionAmount: curatecoAmountPerUnit * item.quantity,
      curatorCommissionAmount: curatorAmountPerUnit * item.quantity,
      basePrice: product.base_price,
      remainingStock: product.stock - item.quantity,
    };
  });

  const byBrand = new Map<string, ResolvedItem[]>();
  for (const item of resolved) {
    byBrand.set(item.brandId, [...(byBrand.get(item.brandId) ?? []), item]);
  }

  const orderRefs: string[] = [];

  for (const [brandId, items] of byBrand) {
    const totalAmount = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const curatorCommissionAmount = items.reduce((sum, i) => sum + i.curatorCommissionAmount, 0);
    const curatecoCommissionAmount = items.reduce((sum, i) => sum + i.curatecoCommissionAmount, 0);
    const brandPayoutAmount = items.reduce((sum, i) => sum + i.basePrice * i.quantity, 0);

    const { data: order, error: orderError } = await service
      .from("orders")
      .insert({
        store_id: store.id,
        curator_id: store.curator_id,
        brand_id: brandId,
        customer_name: parsed.data.customerName,
        customer_phone: parsed.data.customerPhone,
        customer_alt_phone: parsed.data.customerAltPhone || null,
        customer_email: parsed.data.customerEmail || null,
        delivery_address: parsed.data.deliveryAddress,
        status: "new",
        total_amount: totalAmount,
        curator_commission_amount: curatorCommissionAmount,
        curateco_commission_amount: curatecoCommissionAmount,
        brand_payout_amount: brandPayoutAmount,
      })
      .select("id")
      .single();

    if (orderError || !order) throw new Error(orderError?.message ?? "Failed to create order.");

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      store_product_id: item.storeProductId,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      unit_price: item.unitPrice,
      curator_commission_pct: item.curatorCommissionPct,
      subtotal: item.unitPrice * item.quantity,
    }));

    const { error: itemsError } = await service.from("order_items").insert(orderItems);
    if (itemsError) throw new Error(itemsError.message);

    for (const item of items) {
      await service.from("products").update({ stock: item.remainingStock }).eq("id", item.productId);
      if (item.remainingStock <= LOW_STOCK_THRESHOLD) {
        await notifyLowStock(brandId, item.productName, item.remainingStock);
      }
    }

    await service.from("analytics_events").insert({
      event_type: "purchase",
      store_id: store.id,
      curator_id: store.curator_id,
      metadata: { order_id: order.id },
    });

    await notifyNewOrder(order.id, store.curator_id, brandId, totalAmount);

    orderRefs.push(order.id);
  }

  const combinedTotal = resolved.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  await notifyOrderConfirmation(
    parsed.data.customerEmail || null,
    parsed.data.customerName,
    orderRefs[0],
    combinedTotal,
  );

  if (parsed.data.customerEmail) {
    await service
      .from("carts")
      .update({ abandoned_email_sent: true })
      .eq("store_id", store.id)
      .eq("customer_email", parsed.data.customerEmail)
      .eq("abandoned_email_sent", false);
  }

  return { orderRefs };
}
