"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { notifyLowStock, notifyNewProductUploaded } from "@/lib/actions/notify";

const LOW_STOCK_THRESHOLD = 5;

export async function updateProductStock(productId: string, stock: number) {
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .update({ stock })
    .eq("id", productId)
    .select("name, brand_id")
    .single();

  if (error || !product) throw new Error(error?.message ?? "Failed to update stock.");

  if (stock > 0 && stock <= LOW_STOCK_THRESHOLD) {
    await notifyLowStock(product.brand_id, product.name, stock);
  }
}

export async function notifyProductSubmitted(brandId: string, productName: string) {
  const service = createServiceClient();
  const { data: brand } = await service.from("brands").select("business_name").eq("id", brandId).single();
  if (brand) await notifyNewProductUploaded(brand.business_name, productName);
}
