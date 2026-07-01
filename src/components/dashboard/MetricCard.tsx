import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface MetricCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
}

function MetricCard({ label, value, icon: Icon }: MetricCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">{label}</p>
        {Icon && (
          <div className="flex size-9 items-center justify-center rounded-full bg-brand-pale">
            <Icon className="size-4.5 text-brand" />
          </div>
        )}
      </div>
      <p className="mt-3 font-display text-2xl font-medium text-[#1A1A1A]">{value}</p>
    </Card>
  );
}

export { MetricCard };
