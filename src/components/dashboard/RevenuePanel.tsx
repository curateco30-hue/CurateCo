"use client";

import { useMemo, useState } from "react";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { formatNaira } from "@/lib/utils";

interface RevenueOrder {
  total_amount: number | null;
  created_at: string;
}

interface RevenuePanelProps {
  orders: RevenueOrder[];
}

const periods: TabItem[] = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Yearly", value: "yearly" },
];

function bucketLabel(date: Date, period: string): string {
  if (period === "daily") return date.toLocaleDateString("en-NG", { weekday: "short" });
  if (period === "weekly") return `Wk ${Math.ceil(date.getDate() / 7)}`;
  if (period === "monthly") return date.toLocaleDateString("en-NG", { month: "short" });
  if (period === "quarterly") return `Q${Math.floor(date.getMonth() / 3) + 1}`;
  return `${date.getFullYear()}`;
}

function windowStart(period: string): Date {
  const now = new Date();
  const start = new Date(now);
  if (period === "daily") start.setDate(now.getDate() - 6);
  else if (period === "weekly") start.setDate(now.getDate() - 7 * 7);
  else if (period === "monthly") start.setMonth(now.getMonth() - 11);
  else if (period === "quarterly") start.setMonth(now.getMonth() - 12 * 3);
  else start.setFullYear(now.getFullYear() - 4);
  return start;
}

function RevenuePanel({ orders }: RevenuePanelProps) {
  const [period, setPeriod] = useState("monthly");

  const { chartData, total } = useMemo(() => {
    const start = windowStart(period);
    const relevant = orders.filter((o) => new Date(o.created_at) >= start);
    const buckets = new Map<string, number>();
    for (const order of relevant) {
      const label = bucketLabel(new Date(order.created_at), period);
      buckets.set(label, (buckets.get(label) ?? 0) + (order.total_amount ?? 0));
    }
    const data = Array.from(buckets.entries()).map(([label, value]) => ({ label, value }));
    const sum = relevant.reduce((acc, o) => acc + (o.total_amount ?? 0), 0);
    return { chartData: data.length > 0 ? data : [{ label: "—", value: 0 }], total: sum };
  }, [orders, period]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-text-secondary">Revenue</p>
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

export { RevenuePanel };
