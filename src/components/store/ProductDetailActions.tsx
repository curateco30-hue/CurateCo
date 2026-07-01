"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { useCartStore } from "@/lib/store/cart";

interface ProductDetailActionsProps {
  storeSlug: string;
  storeProductId: string;
  productId: string;
  name: string;
  price: number;
  image: string | null;
  sizes: string[];
  colors: string[];
  stock: number;
  curatorCommissionPct: number;
  sizeLabel: string;
  colorLabel: string;
  stockLabel: string;
  addToCartLabel: string;
  shippingNote: string;
}

function ProductDetailActions({
  storeSlug,
  storeProductId,
  productId,
  name,
  price,
  image,
  sizes,
  colors,
  stock,
  curatorCommissionPct,
  sizeLabel,
  colorLabel,
  stockLabel,
  addToCartLabel,
  shippingNote,
}: ProductDetailActionsProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [size, setSize] = useState(sizes[0] ?? "One Size");
  const [color, setColor] = useState(colors[0] ?? "Default");

  const handleAddToCart = () => {
    addItem(storeSlug, {
      productId,
      storeProductId,
      name,
      image,
      price,
      size,
      color,
      quantity: 1,
      curatorCommissionPct,
    });
    toast.success(`${name} added to cart.`);
  };

  return (
    <div className="flex flex-col gap-5">
      {sizes.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-[#1A1A1A]">{sizeLabel}</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 ease-in-out ${
                  size === s ? "border-brand bg-brand-pale text-brand" : "border-border text-text-secondary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-[#1A1A1A]">{colorLabel}</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 ease-in-out ${
                  color === c ? "border-brand bg-brand-pale text-brand" : "border-border text-text-secondary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm text-text-secondary">
        {stockLabel}: {stock > 0 ? stock : "Out of stock"}
      </p>

      <Button className="w-full" disabled={stock === 0} onClick={handleAddToCart}>
        {addToCartLabel}
      </Button>
      <p className="text-center text-xs text-text-muted">{shippingNote}</p>
    </div>
  );
}

export { ProductDetailActions };
