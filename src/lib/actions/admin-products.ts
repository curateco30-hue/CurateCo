"use server";

import { getCurrentAdminOrRedirect } from "@/lib/queries/admin";
import { createServiceClient } from "@/lib/supabase/server";
import { notifyProductApproved, notifyProductRejected } from "@/lib/actions/notify";

export async function approveProduct(productId: string, curatecoCommissionPct: number, capPct: number) {
  await getCurrentAdminOrRedirect();
  const service = createServiceClient();

  const { data: product, error } = await service
    .from("products")
    .update({
      status: "approved",
      curateco_commission_pct: curatecoCommissionPct,
      max_curator_commission_cap_pct: capPct,
      rejection_reason: null,
    })
    .eq("id", productId)
    .select("name, brand_id")
    .single();

  if (error || !product) throw new Error(error?.message ?? "Failed to approve product.");

  await notifyProductApproved(product.brand_id, product.name);
}

export async function rejectProduct(productId: string, reason: string) {
  await getCurrentAdminOrRedirect();
  const service = createServiceClient();

  const { data: product, error } = await service
    .from("products")
    .update({ status: "rejected", rejection_reason: reason })
    .eq("id", productId)
    .select("name, brand_id")
    .single();

  if (error || !product) throw new Error(error?.message ?? "Failed to reject product.");

  await notifyProductRejected(product.brand_id, product.name, reason);
}
