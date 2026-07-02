"use server";

import { getCurrentAdminOrRedirect } from "@/lib/queries/admin";
import { createServiceClient } from "@/lib/supabase/server";

export async function updateMaxStoreProducts(maxStoreProducts: number) {
  const { user } = await getCurrentAdminOrRedirect();
  if (!Number.isInteger(maxStoreProducts) || maxStoreProducts < 1) {
    throw new Error("Enter a whole number of at least 1.");
  }

  const service = createServiceClient();
  const { data: existing } = await service.from("platform_settings").select("id").limit(1).maybeSingle();

  if (existing) {
    const { error } = await service
      .from("platform_settings")
      .update({ max_store_products: maxStoreProducts, updated_by: user.id })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await service
      .from("platform_settings")
      .insert({ max_store_products: maxStoreProducts, updated_by: user.id });
    if (error) throw new Error(error.message);
  }
}
