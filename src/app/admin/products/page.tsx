import { getCurrentAdminOrRedirect } from "@/lib/queries/admin";
import { Card } from "@/components/ui/Card";
import { ProductApprovalManager } from "@/components/dashboard/ProductApprovalManager";

export const metadata = { title: "Product Approvals — CurateCo Admin" };

export default async function AdminProductsPage() {
  const { supabase } = await getCurrentAdminOrRedirect();

  const { data } = await supabase
    .from("products")
    .select(
      "id, name, base_price, curateco_commission_pct, max_curator_commission_cap_pct, images, status, rejection_reason, brands(business_name)",
    )
    .order("created_at", { ascending: false });

  const products = (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    base_price: p.base_price,
    curateco_commission_pct: p.curateco_commission_pct,
    max_curator_commission_cap_pct: p.max_curator_commission_cap_pct,
    images: p.images,
    status: p.status,
    rejection_reason: p.rejection_reason,
    brand_name: (p.brands as unknown as { business_name: string } | null)?.business_name ?? "—",
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-[#1A1A1A]">Product Approvals</h1>
        <p className="text-sm text-text-secondary">Review and approve products submitted by brands.</p>
      </div>
      <Card className="p-6">
        <ProductApprovalManager initialProducts={products} />
      </Card>
    </div>
  );
}
