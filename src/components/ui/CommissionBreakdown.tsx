import { ArrowDown } from "lucide-react";
import { formatNaira } from "@/lib/utils";

interface CommissionBreakdownProps {
  basePrice: number;
  curatecoCommissionPct: number;
  curatorCommissionPct: number;
}

function CommissionBreakdown({
  basePrice,
  curatecoCommissionPct,
  curatorCommissionPct,
}: CommissionBreakdownProps) {
  const afterCurateco = basePrice * (1 + curatecoCommissionPct / 100);
  const finalPrice = afterCurateco * (1 + curatorCommissionPct / 100);

  const rows = [
    { label: "Base Price", value: basePrice },
    {
      label: `+ CurateCo Commission (${curatecoCommissionPct}%)`,
      value: afterCurateco,
    },
    {
      label: `+ Your Commission (${curatorCommissionPct}%)`,
      value: finalPrice,
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-beige p-4">
      <div className="flex flex-col gap-2.5">
        {rows.map((row, idx) => (
          <div key={row.label}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">{row.label}</span>
              <span className="font-medium text-[#1A1A1A]">{formatNaira(row.value)}</span>
            </div>
            {idx < rows.length - 1 && (
              <ArrowDown className="my-1 size-3.5 text-text-muted" />
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="font-display text-base text-[#1A1A1A]">Final Customer Price</span>
        <span className="font-display text-lg font-medium text-brand">
          {formatNaira(finalPrice)}
        </span>
      </div>
    </div>
  );
}

export { CommissionBreakdown };
