interface ProductListingPreviewProps {
  settings: {
    headline?: string;
    subheadline?: string;
    video?: { sectionTitle?: string };
    productCard?: { showBrandName?: boolean; showCommissionCap?: boolean; commissionCapLabel?: string };
    addToStoreLabel?: string;
  };
}

function ProductListingPreview({ settings }: ProductListingPreviewProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white p-4">
      <p className="font-display text-lg font-medium text-[#1A1A1A]">
        {settings.headline ?? "Discover Products"}
      </p>
      <p className="mt-1 text-xs text-text-secondary">{settings.subheadline ?? ""}</p>
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-text-muted">
        {settings.video?.sectionTitle ?? "Featured Videos"}
      </p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="aspect-[9/16] rounded-lg bg-beige" />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-xl border border-border p-2">
            <div className="aspect-square rounded-lg bg-beige" />
            {settings.productCard?.showBrandName && (
              <p className="mt-1.5 text-[10px] text-text-muted">Certified Brand</p>
            )}
            <p className="text-xs font-medium text-[#1A1A1A]">Sample Product</p>
            {settings.productCard?.showCommissionCap && (
              <span className="mt-1 inline-block rounded-full bg-brand-pale px-2 py-0.5 text-[10px] text-brand">
                {settings.productCard?.commissionCapLabel ?? "Commission Cap"}: 15%
              </span>
            )}
            <button className="mt-2 w-full rounded-full bg-brand py-1.5 text-[10px] font-medium text-white">
              {settings.addToStoreLabel ?? "Add to Store"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export { ProductListingPreview };
