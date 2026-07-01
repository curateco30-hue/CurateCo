interface ProductDetailPreviewProps {
  settings: {
    gallery?: { style?: string };
    whyCurated?: {
      sectionTitle?: string;
      backgroundColor?: string;
      fontStyle?: string;
    };
    sizeLabel?: string;
    colorLabel?: string;
    stockLabel?: string;
    addToCartLabel?: string;
    shippingNote?: string;
    relatedProducts?: { show?: boolean; sectionHeading?: string };
  };
}

function ProductDetailPreview({ settings }: ProductDetailPreviewProps) {
  const isItalic = settings.whyCurated?.fontStyle !== "normal";

  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="aspect-square rounded-lg bg-beige" />
        <div>
          <p className="font-display text-base font-medium text-[#1A1A1A]">Sample Product</p>
          <p className="text-xs text-text-secondary">₦65,000</p>
          <p className="mt-2 text-[10px] font-medium text-text-muted">
            {settings.sizeLabel || "Size"}: M &nbsp; {settings.colorLabel || "Color"}: Black
          </p>
          <p className="text-[10px] text-text-muted">{settings.stockLabel || "In Stock"}: 12</p>
          <button className="mt-2 w-full rounded-full bg-brand py-1.5 text-[10px] font-medium text-white">
            {settings.addToCartLabel || "Add to Cart"}
          </button>
          <p className="mt-1 text-[9px] text-text-muted">{settings.shippingNote || ""}</p>
        </div>
      </div>

      <div
        className="mt-4 rounded-lg border-l-4 border-brand p-3"
        style={{ backgroundColor: settings.whyCurated?.backgroundColor || "#F7E8EC" }}
      >
        <p className="text-xs font-semibold text-[#1A1A1A]">
          {settings.whyCurated?.sectionTitle || "Why I Curated This"}
        </p>
        <p className={`mt-1 text-xs text-text-secondary ${isItalic ? "font-display italic" : ""}`}>
          &ldquo;This piece is the first thing I reach for...&rdquo;
        </p>
      </div>

      {settings.relatedProducts?.show !== false && (
        <div className="mt-4">
          <p className="text-xs font-medium text-[#1A1A1A]">
            {settings.relatedProducts?.sectionHeading || "You May Also Like"}
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square rounded-lg bg-beige" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { ProductDetailPreview };
