"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { CommissionBreakdown } from "@/components/ui/CommissionBreakdown";
import { toast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { formatNaira } from "@/lib/utils";

interface ProductCardData {
  id: string;
  name: string;
  brand_name: string;
  base_price: number;
  curateco_commission_pct: number;
  max_curator_commission_cap_pct: number;
  selling_price: number;
  images: string[] | null;
}

interface ProductGridProps {
  products: ProductCardData[];
  storeId: string;
  storeProductCount: number;
  maxStoreProducts: number;
  showBrandName: boolean;
  showCommissionCap: boolean;
  commissionCapLabel: string;
  addToStoreLabel: string;
  emptyStateMessage: string;
}

function ProductGrid({
  products,
  storeId,
  storeProductCount,
  maxStoreProducts,
  showBrandName,
  showCommissionCap,
  commissionCapLabel,
  addToStoreLabel,
  emptyStateMessage,
}: ProductGridProps) {
  const supabase = createClient();
  const [addTarget, setAddTarget] = useState<ProductCardData | null>(null);
  const [commissionPct, setCommissionPct] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [productCount, setProductCount] = useState(storeProductCount);

  const storeIsFull = productCount >= maxStoreProducts;

  const openAddModal = (product: ProductCardData) => {
    setAddTarget(product);
    setCommissionPct(String(Math.min(10, product.max_curator_commission_cap_pct)));
  };

  const confirmAdd = async () => {
    if (!addTarget) return;
    const pct = Number(commissionPct);
    if (!Number.isFinite(pct) || pct < 0) {
      toast.error("Enter a valid commission percentage.");
      return;
    }
    if (pct > addTarget.max_curator_commission_cap_pct) {
      toast.error(`Commission cannot exceed ${addTarget.max_curator_commission_cap_pct}%.`);
      return;
    }

    setIsSaving(true);
    const { error } = await supabase.from("curator_store_products").insert({
      store_id: storeId,
      product_id: addTarget.id,
      curator_commission_pct: pct,
    });
    setIsSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setAddedIds((prev) => [...prev, addTarget.id]);
    setProductCount((prev) => prev + 1);
    toast.success("Added to your store.");
    setAddTarget(null);
  };

  if (products.length === 0) {
    return <p className="py-16 text-center text-sm text-text-muted">{emptyStateMessage}</p>;
  }

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const isAdded = addedIds.includes(product.id);
          return (
            <Card key={product.id} className="flex flex-col overflow-hidden">
              <div className="relative aspect-square bg-beige">
                {product.images?.[0] && (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                {showBrandName && <p className="text-xs text-text-muted">{product.brand_name}</p>}
                <p className="mt-1 text-sm font-medium text-[#1A1A1A]">{product.name}</p>
                <p className="mt-1 text-sm font-semibold text-brand">
                  {formatNaira(product.selling_price)}
                </p>
                {showCommissionCap && (
                  <Badge status="neutral" className="mt-2 w-fit">
                    {commissionCapLabel}: {product.max_curator_commission_cap_pct}%
                  </Badge>
                )}
                <Button
                  className="mt-4 w-full"
                  disabled={isAdded || (storeIsFull && !isAdded)}
                  onClick={() => openAddModal(product)}
                >
                  {isAdded
                    ? "Added"
                    : storeIsFull
                      ? `Store Full (${productCount}/${maxStoreProducts})`
                      : addToStoreLabel}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal isOpen={!!addTarget} onClose={() => setAddTarget(null)} title="Add to Your Store">
        {addTarget && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-text-secondary">{addTarget.name}</p>
            <Input
              label={`Your Commission % (max ${addTarget.max_curator_commission_cap_pct}%)`}
              type="number"
              min={0}
              max={addTarget.max_curator_commission_cap_pct}
              value={commissionPct}
              onChange={(e) => setCommissionPct(e.target.value)}
            />
            <CommissionBreakdown
              basePrice={addTarget.base_price}
              curatecoCommissionPct={addTarget.curateco_commission_pct}
              curatorCommissionPct={Number(commissionPct) || 0}
            />
            <Button onClick={confirmAdd} isLoading={isSaving} className="w-full">
              Confirm
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
}

export { ProductGrid };
