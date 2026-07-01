import { ShoppingBag, Wallet, PackageCheck, AlertTriangle } from "lucide-react";
import { getCurrentBrandOrRedirect } from "@/lib/queries/brand";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RevenuePanel } from "@/components/dashboard/RevenuePanel";
import { BrandDashboardTabs } from "@/components/dashboard/BrandDashboardTabs";
import { formatNaira } from "@/lib/utils";

export const metadata = { title: "Dashboard — CurateCo" };

export default async function BrandDashboardPage() {
  const { supabase, brand } = await getCurrentBrandOrRedirect();

  const [{ data: products }, { data: orders }] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, base_price, stock, status")
      .eq("brand_id", brand.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("orders")
      .select("id, customer_name, total_amount, brand_payout_amount, status, created_at")
      .eq("brand_id", brand.id)
      .order("created_at", { ascending: false }),
  ]);

  const allProducts = products ?? [];
  const allOrders = orders ?? [];
  const totalRevenue = allOrders.reduce((sum, o) => sum + (o.brand_payout_amount ?? 0), 0);
  const lowStockCount = allProducts.filter((p) => p.stock <= 5).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-[#1A1A1A]">
          Welcome back, {brand.business_name}
        </h1>
        <p className="text-sm text-text-secondary">Here&apos;s how your brand is performing.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total Orders" value={String(allOrders.length)} icon={ShoppingBag} />
        <MetricCard label="Total Revenue" value={formatNaira(totalRevenue)} icon={Wallet} />
        <MetricCard
          label="Approved Products"
          value={String(allProducts.filter((p) => p.status === "approved").length)}
          icon={PackageCheck}
        />
        <MetricCard label="Low Stock Alerts" value={String(lowStockCount)} icon={AlertTriangle} />
      </div>

      <Card className="p-6">
        <RevenuePanel orders={allOrders} />
      </Card>

      <Card className="p-6">
        <BrandDashboardTabs products={allProducts} orders={allOrders} />
      </Card>
    </div>
  );
}
