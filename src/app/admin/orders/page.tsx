import { getCurrentAdminOrRedirect } from "@/lib/queries/admin";
import { Card } from "@/components/ui/Card";
import { AdminOrdersManager } from "@/components/dashboard/AdminOrdersManager";

export const metadata = { title: "Orders — CurateCo Admin" };

export default async function AdminOrdersPage() {
  const { supabase } = await getCurrentAdminOrRedirect();

  const { data } = await supabase
    .from("orders")
    .select(
      "id, customer_name, total_amount, status, created_at, curators(brand_name), brands(business_name)",
    )
    .order("created_at", { ascending: false });

  const orders = (data ?? []).map((o) => ({
    id: o.id,
    customer_name: o.customer_name,
    curator_name: (o.curators as unknown as { brand_name: string } | null)?.brand_name ?? "—",
    brand_name: (o.brands as unknown as { business_name: string } | null)?.business_name ?? "—",
    total_amount: o.total_amount,
    status: o.status,
    created_at: o.created_at,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-[#1A1A1A]">Orders</h1>
        <p className="text-sm text-text-secondary">Track and update every order on the platform.</p>
      </div>
      <Card className="p-2 sm:p-4">
        <AdminOrdersManager initialOrders={orders} />
      </Card>
    </div>
  );
}
