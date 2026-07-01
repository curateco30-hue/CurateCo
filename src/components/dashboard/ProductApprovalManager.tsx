"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Tabs } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import { approveProduct, rejectProduct } from "@/lib/actions/admin-products";
import { formatNaira } from "@/lib/utils";
import type { ProductStatus } from "@/types/database";

interface ProductRow {
  id: string;
  name: string;
  base_price: number;
  curateco_commission_pct: number;
  max_curator_commission_cap_pct: number;
  images: string[] | null;
  status: ProductStatus;
  rejection_reason: string | null;
  brand_name: string;
}

interface ProductApprovalManagerProps {
  initialProducts: ProductRow[];
}

const statusTabs: { label: string; value: ProductStatus | "all" }[] = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "All", value: "all" },
];

function ProductApprovalManager({ initialProducts }: ProductApprovalManagerProps) {
  const [products, setProducts] = useState(initialProducts);
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("pending");
  const [approveTarget, setApproveTarget] = useState<ProductRow | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ProductRow | null>(null);
  const [curatecoPct, setCuratecoPct] = useState("");
  const [capPct, setCapPct] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const filtered = useMemo(
    () => (statusFilter === "all" ? products : products.filter((p) => p.status === statusFilter)),
    [products, statusFilter],
  );

  const openApprove = (product: ProductRow) => {
    setApproveTarget(product);
    setCuratecoPct(String(product.curateco_commission_pct || 10));
    setCapPct(String(product.max_curator_commission_cap_pct || 15));
  };

  const confirmApprove = async () => {
    if (!approveTarget) return;
    const curateco = Number(curatecoPct);
    const cap = Number(capPct);
    if (!Number.isFinite(curateco) || curateco < 0 || !Number.isFinite(cap) || cap < 0) {
      toast.error("Enter valid commission percentages.");
      return;
    }
    setIsSaving(true);
    try {
      await approveProduct(approveTarget.id, curateco, cap);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === approveTarget.id
            ? {
                ...p,
                status: "approved",
                curateco_commission_pct: curateco,
                max_curator_commission_cap_pct: cap,
                rejection_reason: null,
              }
            : p,
        ),
      );
      toast.success("Product approved.");
      setApproveTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to approve product.");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    if (rejectionReason.trim().length < 5) {
      toast.error("Enter a rejection reason.");
      return;
    }
    setIsSaving(true);
    try {
      await rejectProduct(rejectTarget.id, rejectionReason.trim());
      setProducts((prev) =>
        prev.map((p) =>
          p.id === rejectTarget.id
            ? { ...p, status: "rejected", rejection_reason: rejectionReason.trim() }
            : p,
        ),
      );
      toast.success("Product rejected.");
      setRejectTarget(null);
      setRejectionReason("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reject product.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <Tabs
        tabs={statusTabs}
        value={statusFilter}
        onChange={(v) => setStatusFilter(v as ProductStatus | "all")}
      />

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-text-muted">No products in this category.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-text-muted">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Brand</th>
                <th className="px-4 py-3 font-medium">Base Price</th>
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
                  <td className="px-4 py-3 text-text-secondary">{product.brand_name}</td>
                  <td className="px-4 py-3 text-text-secondary">{formatNaira(product.base_price)}</td>
                  <td className="px-4 py-3">
                    <Badge status={product.status} />
                    {product.status === "rejected" && product.rejection_reason && (
                      <p className="mt-1 max-w-[200px] text-xs text-red-600">
                        {product.rejection_reason}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => openApprove(product)}>
                        {product.status === "approved" ? "Edit" : "Approve"}
                      </Button>
                      {product.status !== "rejected" && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setRejectTarget(product)}
                        >
                          Reject
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={!!approveTarget} onClose={() => setApproveTarget(null)} title="Approve Product">
        {approveTarget && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-text-secondary">{approveTarget.name}</p>
            <Input
              label="CurateCo Commission %"
              type="number"
              min={0}
              value={curatecoPct}
              onChange={(e) => setCuratecoPct(e.target.value)}
            />
            <Input
              label="Max Curator Commission Cap %"
              type="number"
              min={0}
              value={capPct}
              onChange={(e) => setCapPct(e.target.value)}
            />
            <Button onClick={confirmApprove} isLoading={isSaving} className="w-full">
              Confirm
            </Button>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Reject Product">
        {rejectTarget && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-text-secondary">{rejectTarget.name}</p>
            <Textarea
              label="Rejection Reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              maxLength={300}
            />
            <Button onClick={confirmReject} isLoading={isSaving} variant="danger" className="w-full">
              Confirm Rejection
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export { ProductApprovalManager };
