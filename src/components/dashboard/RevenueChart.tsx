import { formatNaira } from "@/lib/utils";

interface RevenueChartProps {
  data: { label: string; value: number }[];
}

function RevenueChart({ data }: RevenueChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  if (data.every((d) => d.value === 0)) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-text-muted">
        No revenue recorded for this period yet.
      </div>
    );
  }

  return (
    <div className="flex h-48 items-end gap-2">
      {data.map((point) => (
        <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-36 w-full items-end">
            <div
              className="w-full rounded-t-md bg-brand transition-all duration-300 ease-in-out"
              style={{ height: `${Math.max((point.value / max) * 100, point.value > 0 ? 4 : 0)}%` }}
              title={formatNaira(point.value)}
            />
          </div>
          <span className="text-xs text-text-muted">{point.label}</span>
        </div>
      ))}
    </div>
  );
}

export { RevenueChart };
