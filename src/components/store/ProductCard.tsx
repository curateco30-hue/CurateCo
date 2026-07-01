"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { useCartStore } from "@/lib/store/cart";
import { formatNaira } from "@/lib/utils";

interface ProductCardProps {
  storeSlug: string;
  storeProductId: string;
  productId: string;
  name: string;
  price: number;
  image: string | null;
  sizes: string[] | null;
  colors: string[] | null;
  curatorCommissionPct: number;
  addToCartLabel: string;
}

function ProductCard({
  storeSlug,
  storeProductId,
  productId,
  name,
  price,
  image,
  sizes,
  colors,
  curatorCommissionPct,
  addToCartLabel,
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    addItem(storeSlug, {
      productId,
      storeProductId,
      name,
      image,
      price,
      size: sizes?.[0] ?? "One Size",
      color: colors?.[0] ?? "Default",
      quantity: 1,
      curatorCommissionPct,
    });
    toast.success(`${name} added to cart.`);
  };

  return (
    <Card className="flex flex-col overflow-hidden">
      <Link href={`/store/${storeSlug}/product/${productId}`}>
        <div className="relative aspect-square bg-beige">
          {image && (
            <Image src={image} alt={name} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/store/${storeSlug}/product/${productId}`}>
          <p className="text-sm font-medium text-[#1A1A1A] hover:text-brand">{name}</p>
        </Link>
        <p className="mt-1 text-sm font-semibold text-brand">{formatNaira(price)}</p>
        <Button className="mt-4 w-full" onClick={handleAddToCart}>
          {addToCartLabel}
        </Button>
      </div>
    </Card>
  );
}

export { ProductCard };
