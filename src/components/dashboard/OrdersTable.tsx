import { Badge, type BadgeStatus } from "@/components/ui/Badge";
import { formatNaira } from "@/lib/utils";
import type { OrderStatus } from "@/types/database";

interface OrderRow {
  id: string;
  customer_name: string;
  total_amount: number | null;
  status: OrderStatus;
  created_at: string;
}

interface OrdersTableProps {
  orders: OrderRow[];
  emptyMessage?: string;
}

function OrdersTable({ orders, emptyMessage = "No orders yet." }: OrdersTableProps) {
  if (orders.length === 0) {
    return <p className="py-10 text-center text-sm text-text-muted">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-text-muted">
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Date</th>
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
              <td className="px-4 py-3 text-text-secondary">
                {new Date(order.created_at).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-3 font-medium text-[#1A1A1A]">
                {order.total_amount != null ? formatNaira(order.total_amount) : "—"}
              </td>
              <td className="px-4 py-3">
                <Badge status={order.status as BadgeStatus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { OrdersTable };
export type { OrderRow };
