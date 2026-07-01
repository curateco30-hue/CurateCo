import { getCurrentBrandOrRedirect } from "@/lib/queries/brand";
import { Card } from "@/components/ui/Card";
import { OrdersTable } from "@/components/dashboard/OrdersTable";

export const metadata = { title: "Orders — CurateCo" };

export default async function BrandOrdersPage() {
  const { supabase, brand } = await getCurrentBrandOrRedirect();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, customer_name, total_amount, status, created_at")
    .eq("brand_id", brand.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-[#1A1A1A]">Orders</h1>
        <p className="text-sm text-text-secondary">All orders placed for your products.</p>
      </div>
      <Card className="p-2 sm:p-4">
        <OrdersTable orders={orders ?? []} emptyMessage="No orders yet." />
      </Card>
    </div>
  );
}
