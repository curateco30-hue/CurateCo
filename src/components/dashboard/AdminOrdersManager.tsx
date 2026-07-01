"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { toast } from "@/components/ui/Toast";
import { updateOrderStatus } from "@/lib/actions/admin-orders";
import { formatNaira } from "@/lib/utils";
import type { OrderStatus } from "@/types/database";

interface AdminOrderRow {
  id: string;
  customer_name: string;
  curator_name: string;
  brand_name: string;
  total_amount: number | null;
  status: OrderStatus;
  created_at: string;
}

interface AdminOrdersManagerProps {
  initialOrders: AdminOrderRow[];
}

const statusOptions: { label: string; value: OrderStatus }[] = [
  { label: "New", value: "new" },
  { label: "Brand Accepted", value: "brand_accepted" },
  { label: "Awaiting Pickup", value: "awaiting_pickup" },
  { label: "Picked Up", value: "picked_up" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

function AdminOrdersManager({ initialOrders }: AdminOrdersManagerProps) {
  const [orders, setOrders] = useState(initialOrders);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      toast.success("Order status updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update order status.");
    }
  };

  if (orders.length === 0) {
    return <p className="py-16 text-center text-sm text-text-muted">No orders yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-text-muted">
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Curator</th>
            <th className="px-4 py-3 font-medium">Brand</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3 font-mono text-xs text-text-secondary">
                {order.id.slice(0, 8)}
              </td>
              <td className="px-4 py-3 text-[#1A1A1A]">{order.customer_name}</td>
              <td className="px-4 py-3 text-text-secondary">{order.curator_name}</td>
              <td className="px-4 py-3 text-text-secondary">{order.brand_name}</td>
              <td className="px-4 py-3 font-medium text-[#1A1A1A]">
                {order.total_amount != null ? formatNaira(order.total_amount) : "—"}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Badge status={order.status} />
                  <Select
                    options={statusOptions}
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                    className="w-40 py-1.5 text-xs"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { AdminOrdersManager };
export type { AdminOrderRow };
