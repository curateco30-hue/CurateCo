import { ShoppingBag, Wallet, Clock, TrendingUp } from "lucide-react";
import { getCurrentCuratorOrRedirect } from "@/lib/queries/curator";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CuratorRevenuePanel } from "@/components/dashboard/CuratorRevenuePanel";
import { AnalyticsSection } from "@/components/dashboard/AnalyticsSection";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { formatNaira } from "@/lib/utils";

export const metadata = { title: "Dashboard — CurateCo" };

export default async function CuratorDashboardPage() {
  const { supabase, curator } = await getCurrentCuratorOrRedirect();

  const [{ data: orders }, { data: events }] = await Promise.all([
    supabase
      .from("orders")
      .select("id, customer_name, total_amount, curator_commission_amount, status, created_at")
      .eq("curator_id", curator.id)
      .order("created_at", { ascending: false }),
    supabase.from("analytics_events").select("event_type").eq("curator_id", curator.id),
  ]);

  const allOrders = orders ?? [];
  const allEvents = events ?? [];
  const countEvents = (type: string) => allEvents.filter((e) => e.event_type === type).length;
  const totalRevenue = allOrders.reduce((sum, o) => sum + (o.curator_commission_amount ?? 0), 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-[#1A1A1A]">
          Welcome back, {curator.brand_name}
        </h1>
        <p className="text-sm text-text-secondary">Here&apos;s how your storefront is performing.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total Orders" value={String(allOrders.length)} icon={ShoppingBag} />
        <MetricCard label="Wallet Balance" value={formatNaira(curator.wallet_balance)} icon={Wallet} />
        <MetricCard
          label="Pending Commission"
          value={formatNaira(curator.pending_commission)}
          icon={Clock}
        />
        <MetricCard label="Total Revenue" value={formatNaira(totalRevenue)} icon={TrendingUp} />
      </div>

      <Card className="p-6">
        <p className="mb-4 text-sm font-medium text-[#1A1A1A]">Analytics</p>
        <AnalyticsSection
          storeViews={countEvents("store_view")}
          productViews={countEvents("product_view")}
          cartAbandonments={countEvents("abandonment")}
          purchases={countEvents("purchase")}
        />
      </Card>

      <Card className="p-6">
        <CuratorRevenuePanel orders={allOrders} />
      </Card>

      <Card className="p-2 sm:p-4">
        <p className="p-3 text-sm font-medium text-[#1A1A1A]">Recent Orders</p>
        <OrdersTable orders={allOrders.slice(0, 5)} emptyMessage="No orders yet." />
      </Card>
    </div>
  );
}
