"use server";

import { getCurrentAdminOrRedirect } from "@/lib/queries/admin";
import { createServiceClient } from "@/lib/supabase/server";
import { notifyOrderStatusChanged } from "@/lib/actions/notify";
import type { OrderStatus } from "@/types/database";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await getCurrentAdminOrRedirect();
  const service = createServiceClient();

  const { data: order, error } = await service
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select("curator_id, brand_id, customer_email, customer_name")
    .single();

  if (error || !order) throw new Error(error?.message ?? "Failed to update order status.");

  await notifyOrderStatusChanged(
    orderId,
    status,
    order.curator_id,
    order.brand_id,
    order.customer_email,
    order.customer_name,
  );
}
