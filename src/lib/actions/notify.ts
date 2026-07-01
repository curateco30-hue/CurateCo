import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail, ADMIN_EMAIL } from "@/lib/email/send";
import { templates } from "@/lib/email/templates";
import { formatNaira } from "@/lib/utils";
import type { Json } from "@/types/database";

/** Notifications are best-effort side effects. A failure here (transient
 *  network blip, stale server-action reference right after a deploy, etc.)
 *  must never bubble up and break the caller's primary flow (signup,
 *  checkout, product approval...). */
function safe<Args extends unknown[]>(fn: (...args: Args) => Promise<void>) {
  return async (...args: Args) => {
    try {
      await fn(...args);
    } catch (err) {
      console.error("[notify] failed:", err);
    }
  };
}

async function insertNotification(
  recipientProfileId: string | null,
  type: string,
  title: string,
  message: string,
  metadata?: Json,
) {
  if (!recipientProfileId) return;
  const service = createServiceClient();
  await service.from("notifications").insert({
    recipient_profile_id: recipientProfileId,
    type,
    title,
    message,
    metadata,
  });
}

async function getCuratorContact(curatorId: string) {
  const service = createServiceClient();
  const { data } = await service
    .from("curators")
    .select("brand_name, profile_id, profiles(email)")
    .eq("id", curatorId)
    .single();
  if (!data) return null;
  return {
    profileId: data.profile_id,
    name: data.brand_name,
    email: (data.profiles as unknown as { email: string } | null)?.email ?? null,
  };
}

async function getBrandContact(brandId: string) {
  const service = createServiceClient();
  const { data } = await service
    .from("brands")
    .select("business_name, profile_id, profiles(email)")
    .eq("id", brandId)
    .single();
  if (!data) return null;
  return {
    profileId: data.profile_id,
    name: data.business_name,
    email: (data.profiles as unknown as { email: string } | null)?.email ?? null,
  };
}

export const notifyNewOrder = safe(async (orderId: string, curatorId: string, brandId: string, totalAmount: number) => {
  const orderRef = orderId.slice(0, 8).toUpperCase();
  const total = formatNaira(totalAmount);

  const [curator, brand] = await Promise.all([getCuratorContact(curatorId), getBrandContact(brandId)]);

  if (curator) {
    const t = templates.newOrderForCurator(curator.name, orderRef, total);
    await Promise.all([
      insertNotification(curator.profileId, "new_order", t.subject, `Order #${orderRef} — ${total}`),
      curator.email ? sendEmail(curator.email, t.subject, t.html) : Promise.resolve(),
    ]);
  }
  if (brand) {
    const t = templates.newOrderForBrand(brand.name, orderRef, total);
    await Promise.all([
      insertNotification(brand.profileId, "new_order", t.subject, `Order #${orderRef} — ${total}`),
      brand.email ? sendEmail(brand.email, t.subject, t.html) : Promise.resolve(),
    ]);
  }
  const adminT = templates.newOrderForAdmin(orderRef, total);
  await sendEmail(ADMIN_EMAIL, adminT.subject, adminT.html);
});

export const notifyOrderConfirmation = safe(
  async (customerEmail: string | null, customerName: string, orderId: string, totalAmount: number) => {
    if (!customerEmail) return;
    const t = templates.orderConfirmation(customerName, orderId.slice(0, 8).toUpperCase(), formatNaira(totalAmount));
    await sendEmail(customerEmail, t.subject, t.html);
  },
);

export const notifyProductApproved = safe(async (brandId: string, productName: string) => {
  const brand = await getBrandContact(brandId);
  if (!brand) return;
  const t = templates.productApproved(brand.name, productName);
  await Promise.all([
    insertNotification(brand.profileId, "product_approved", t.subject, productName),
    brand.email ? sendEmail(brand.email, t.subject, t.html) : Promise.resolve(),
  ]);
});

export const notifyProductRejected = safe(async (brandId: string, productName: string, reason: string) => {
  const brand = await getBrandContact(brandId);
  if (!brand) return;
  const t = templates.productRejected(brand.name, productName, reason);
  await Promise.all([
    insertNotification(brand.profileId, "product_rejected", t.subject, `${productName}: ${reason}`),
    brand.email ? sendEmail(brand.email, t.subject, t.html) : Promise.resolve(),
  ]);
});

const ORDER_STATUS_LABELS: Record<string, string> = {
  new: "New",
  brand_accepted: "Brand Accepted",
  awaiting_pickup: "Awaiting Pickup",
  picked_up: "Picked Up",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const notifyOrderStatusChanged = safe(
  async (
    orderId: string,
    status: string,
    curatorId: string | null,
    brandId: string | null,
    customerEmail: string | null,
    customerName: string,
  ) => {
    const statusLabel = ORDER_STATUS_LABELS[status] ?? status;
    const orderRef = orderId;

    const [curator, brand] = await Promise.all([
      curatorId ? getCuratorContact(curatorId) : null,
      brandId ? getBrandContact(brandId) : null,
    ]);

    if (curator) {
      const t = templates.orderStatusChanged(curator.name, orderRef, statusLabel, `${process.env.NEXT_PUBLIC_APP_URL}/curator/dashboard`);
      await Promise.all([
        insertNotification(curator.profileId, "order_status", t.subject, statusLabel),
        curator.email ? sendEmail(curator.email, t.subject, t.html) : Promise.resolve(),
      ]);
    }
    if (brand) {
      const t = templates.orderStatusChanged(brand.name, orderRef, statusLabel, `${process.env.NEXT_PUBLIC_APP_URL}/brand/orders`);
      await Promise.all([
        insertNotification(brand.profileId, "order_status", t.subject, statusLabel),
        brand.email ? sendEmail(brand.email, t.subject, t.html) : Promise.resolve(),
      ]);
    }
    if (status === "delivered" && customerEmail) {
      const t = templates.orderStatusChanged(customerName, orderRef, statusLabel, `${process.env.NEXT_PUBLIC_APP_URL}`);
      await sendEmail(customerEmail, t.subject, t.html);
    }

    const adminT = templates.orderStatusChanged("Admin", orderRef, statusLabel, `${process.env.NEXT_PUBLIC_APP_URL}/admin/orders`);
    await sendEmail(ADMIN_EMAIL, adminT.subject, adminT.html);
  },
);

export const notifyLowStock = safe(async (brandId: string, productName: string, stock: number) => {
  const brand = await getBrandContact(brandId);
  if (!brand) return;
  const t = templates.lowStock(brand.name, productName, stock);
  await Promise.all([
    insertNotification(brand.profileId, "low_stock", t.subject, `${productName}: ${stock} left`),
    brand.email ? sendEmail(brand.email, t.subject, t.html) : Promise.resolve(),
    sendEmail(ADMIN_EMAIL, t.subject, t.html),
  ]);
});

export const notifyNewCuratorRegistered = safe(async (brandName: string) => {
  const t = templates.newCuratorRegistered(brandName);
  await sendEmail(ADMIN_EMAIL, t.subject, t.html);
});

export const notifyNewBrandRegistered = safe(async (businessName: string) => {
  const t = templates.newBrandRegistered(businessName);
  await sendEmail(ADMIN_EMAIL, t.subject, t.html);
});

export const notifyNewProductUploaded = safe(async (businessName: string, productName: string) => {
  const t = templates.newProductUploaded(businessName, productName);
  await sendEmail(ADMIN_EMAIL, t.subject, t.html);
});

export const notifyNewSupportMessage = safe(async (senderName: string) => {
  const t = templates.newSupportMessage(senderName);
  await sendEmail(ADMIN_EMAIL, t.subject, t.html);
});

export const notifyCartAbandonment = safe(async (customerEmail: string, storeName: string, storeSlug: string) => {
  const t = templates.cartAbandonment(storeName, storeSlug);
  await sendEmail(customerEmail, t.subject, t.html);
});
