import { createServiceClient } from "@/lib/supabase/server";

interface LogEventInput {
  eventType: "store_view" | "product_view" | "cart_add" | "purchase" | "abandonment";
  storeId?: string;
  productId?: string;
  curatorId?: string;
}

export async function logAnalyticsEvent({ eventType, storeId, productId, curatorId }: LogEventInput) {
  const service = createServiceClient();
  await service.from("analytics_events").insert({
    event_type: eventType,
    store_id: storeId,
    product_id: productId,
    curator_id: curatorId,
  });
}
