import { Eye, MousePointerClick, ShoppingCart, CheckCircle2, Percent } from "lucide-react";

interface AnalyticsSectionProps {
  storeViews: number;
  productViews: number;
  cartAbandonments: number;
  purchases: number;
}

function AnalyticsSection({
  storeViews,
  productViews,
  cartAbandonments,
  purchases,
}: AnalyticsSectionProps) {
  const conversionRate = storeViews > 0 ? ((purchases / storeViews) * 100).toFixed(1) : "0.0";

  const stats = [
    { label: "Store Views", value: storeViews, icon: Eye },
    { label: "Product Views", value: productViews, icon: MousePointerClick },
    { label: "Cart Abandonments", value: cartAbandonments, icon: ShoppingCart },
    { label: "Purchases", value: purchases, icon: CheckCircle2 },
    { label: "Conversion Rate", value: `${conversionRate}%`, icon: Percent },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-border bg-white p-4">
          <stat.icon className="size-4 text-brand" />
          <p className="mt-2 font-display text-xl font-medium text-[#1A1A1A]">{stat.value}</p>
          <p className="text-xs text-text-muted">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export { AnalyticsSection };
