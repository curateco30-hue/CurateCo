interface StorefrontPreviewProps {
  settings: {
    hero?: { overlayOpacity?: number; headingFontSize?: string };
    brandNameFormat?: { prefix?: string; suffix?: string };
    intro?: { label?: string };
    productCollection?: { sectionHeading?: string; gridColumns?: number };
    footer?: { text?: string };
    global?: { addToCartLabel?: string };
  };
}

function StorefrontPreview({ settings }: StorefrontPreviewProps) {
  const opacity = settings.hero?.overlayOpacity ?? 0.5;
  const cols = settings.productCollection?.gridColumns ?? 3;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <div className="relative flex h-40 items-end bg-brand-pale p-4">
        <div className="absolute inset-0 bg-black" style={{ opacity }} />
        <p
          className="relative font-display italic text-white"
          style={{ fontSize: settings.hero?.headingFontSize ?? "24px" }}
        >
          {settings.brandNameFormat?.prefix ?? "Curated by"} Demo Curator
          {settings.brandNameFormat?.suffix ?? ""}
        </p>
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-text-muted">
          {settings.intro?.label ?? "About"}
        </p>
        <p className="mt-1 text-xs text-text-secondary">
          A short introduction from the curator appears here.
        </p>
        <p className="mt-4 text-sm font-medium text-[#1A1A1A]">
          {settings.productCollection?.sectionHeading ?? "My Tastes"}
        </p>
        <div className="mt-2 grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-beige" />
          ))}
        </div>
        <button className="mt-4 w-full rounded-full bg-brand py-2 text-xs font-medium text-white">
          {settings.global?.addToCartLabel ?? "Add to Cart"}
        </button>
        <p className="mt-3 text-center text-xs text-text-muted">
          {settings.footer?.text ?? ""}
        </p>
      </div>
    </div>
  );
}

export { StorefrontPreview };
