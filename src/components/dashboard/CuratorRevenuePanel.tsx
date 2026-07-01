"use client";

import { useMemo, useState } from "react";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { formatNaira } from "@/lib/utils";

interface RevenueOrder {
  curator_commission_amount: number | null;
  created_at: string;
}

interface CuratorRevenuePanelProps {
  orders: RevenueOrder[];
}

const periods: TabItem[] = [
  { label: "24 Hours", value: "24h" },
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
];

const windowHours: Record<string, number> = { "24h": 24, "7d": 24 * 7, "30d": 24 * 30, "90d": 24 * 90 };

function bucketLabel(date: Date, period: string): string {
  if (period === "24h") return date.toLocaleTimeString("en-NG", { hour: "numeric" });
  return date.toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

function CuratorRevenuePanel({ orders }: CuratorRevenuePanelProps) {
  const [period, setPeriod] = useState("7d");

  const { chartData, total } = useMemo(() => {
    const cutoff = new Date(Date.now() - windowHours[period] * 60 * 60 * 1000);
    const relevant = orders.filter((o) => new Date(o.created_at) >= cutoff);
    const buckets = new Map<string, number>();
    for (const order of relevant) {
      const label = bucketLabel(new Date(order.created_at), period);
      buckets.set(label, (buckets.get(label) ?? 0) + (order.curator_commission_amount ?? 0));
    }
    const data = Array.from(buckets.entries()).map(([label, value]) => ({ label, value }));
    const sum = relevant.reduce((acc, o) => acc + (o.curator_commission_amount ?? 0), 0);
    return { chartData: data.length > 0 ? data : [{ label: "—", value: 0 }], total: sum };
  }, [orders, period]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-text-secondary">Commission Earned</p>
          <p className="font-display text-2xl font-medium text-[#1A1A1A]">{formatNaira(total)}</p>
        </div>
        <Tabs tabs={periods} value={period} onChange={setPeriod} />
      </div>
      <div className="mt-6">
        <RevenueChart data={chartData} />
      </div>
    </div>
  );
}

export { CuratorRevenuePanel };
