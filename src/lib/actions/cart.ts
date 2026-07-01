"use server";

import { createServiceClient } from "@/lib/supabase/server";

interface CartSnapshotItem {
  productId: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
}

export async function saveCartSnapshot(storeSlug: string, customerEmail: string, items: CartSnapshotItem[]) {
  if (!customerEmail || items.length === 0) return;

  const service = createServiceClient();

  const { data: store } = await service
    .from("curator_stores")
    .select("id")
    .eq("store_slug", storeSlug)
    .single();
  if (!store) return;

  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: existing } = await service
    .from("carts")
    .select("id")
    .eq("store_id", store.id)
    .eq("customer_email", customerEmail)
    .eq("abandoned_email_sent", false)
    .gte("created_at", dayAgo)
    .maybeSingle();

  const itemsJson = items as unknown as import("@/types/database").Json;

  if (existing) {
    await service.from("carts").update({ items: itemsJson }).eq("id", existing.id);
  } else {
    await service.from("carts").insert({ store_id: store.id, customer_email: customerEmail, items: itemsJson });
  }
}
