import { Users, Store, ShoppingBag, Wallet, MessagesSquare, AlertTriangle } from "lucide-react";
import { getCurrentAdminOrRedirect } from "@/lib/queries/admin";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { formatNaira } from "@/lib/utils";

export const metadata = { title: "Admin Dashboard — CurateCo" };

export default async function AdminDashboardPage() {
  const { supabase } = await getCurrentAdminOrRedirect();

  const [
    { count: curatorCount },
    { count: brandCount },
    { count: orderCount },
    { data: orders },
    { count: pendingSupportCount },
    { count: lowStockCount },
  ] = await Promise.all([
    supabase.from("curators").select("*", { count: "exact", head: true }),
    supabase.from("brands").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total_amount"),
    supabase.from("support_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
    supabase.from("products").select("*", { count: "exact", head: true }).lte("stock", 5),
  ]);

  const totalRevenue = (orders ?? []).reduce((sum, o) => sum + (o.total_amount ?? 0), 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-[#1A1A1A]">Admin Dashboard</h1>
        <p className="text-sm text-text-secondary">Platform-wide overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard label="Registered Curators" value={String(curatorCount ?? 0)} icon={Users} />
        <MetricCard label="Registered Brands" value={String(brandCount ?? 0)} icon={Store} />
        <MetricCard label="Total Orders" value={String(orderCount ?? 0)} icon={ShoppingBag} />
        <MetricCard label="Total Revenue" value={formatNaira(totalRevenue)} icon={Wallet} />
        <MetricCard
          label="Pending Support Messages"
          value={String(pendingSupportCount ?? 0)}
          icon={MessagesSquare}
        />
        <MetricCard label="Low Stock Alerts" value={String(lowStockCount ?? 0)} icon={AlertTriangle} />
      </div>
    </div>
  );
}
