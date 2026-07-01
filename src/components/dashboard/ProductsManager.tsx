"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import { updateProductStock } from "@/lib/actions/brand-products";
import { formatNaira } from "@/lib/utils";
import type { ProductStatus } from "@/types/database";

interface ProductRow {
  id: string;
  name: string;
  base_price: number;
  selling_price: number;
  stock: number;
  images: string[] | null;
  status: ProductStatus;
  rejection_reason: string | null;
}

interface ProductsManagerProps {
  initialProducts: ProductRow[];
}

const statusTabs: { label: string; value: ProductStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

function ProductsManager({ initialProducts }: ProductsManagerProps) {
  const [products, setProducts] = useState(initialProducts);
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all");
  const [stockModalProduct, setStockModalProduct] = useState<ProductRow | null>(null);
  const [newStock, setNewStock] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const filtered = useMemo(
    () =>
      statusFilter === "all" ? products : products.filter((p) => p.status === statusFilter),
    [products, statusFilter],
  );

  const openStockModal = (product: ProductRow) => {
    setStockModalProduct(product);
    setNewStock(String(product.stock));
  };

  const saveStock = async () => {
    if (!stockModalProduct) return;
    const stockValue = Number(newStock);
    if (!Number.isFinite(stockValue) || stockValue < 0) {
      toast.error("Enter a valid stock quantity.");
      return;
    }
    setIsSaving(true);
    try {
      await updateProductStock(stockModalProduct.id, stockValue);
      setProducts((prev) =>
        prev.map((p) => (p.id === stockModalProduct.id ? { ...p, stock: stockValue } : p)),
      );
      toast.success("Stock updated.");
      setStockModalProduct(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update stock.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          tabs={statusTabs}
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as ProductStatus | "all")}
        />
        <Link href="/brand/products/new">
          <Button>
            <Plus className="size-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-text-muted">No products in this category.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-text-muted">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Base Price</th>
                <th className="px-4 py-3 font-medium">Selling Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0">
                  <td className="flex items-center gap-3 px-4 py-3">
                    <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-beige">
                      {product.images?.[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <span className="font-medium text-[#1A1A1A]">{product.name}</span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{formatNaira(product.base_price)}</td>
                  <td className="px-4 py-3 text-text-secondary">
                    {formatNaira(product.selling_price)}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{product.stock}</td>
                  <td className="px-4 py-3">
                    <Badge status={product.status} />
                    {product.status === "rejected" && product.rejection_reason && (
                      <p className="mt-1 max-w-[200px] text-xs text-red-600">
                        {product.rejection_reason}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="secondary" onClick={() => openStockModal(product)}>
                      Update Stock
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={!!stockModalProduct}
        onClose={() => setStockModalProduct(null)}
        title="Update Stock"
      >
        {stockModalProduct && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-text-secondary">{stockModalProduct.name}</p>
            <Input
              label="Available Stock"
              type="number"
              min={0}
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
            />
            <Button onClick={saveStock} isLoading={isSaving} className="w-full">
              Save Changes
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export { ProductsManager };
