import { getCurrentBrandOrRedirect } from "@/lib/queries/brand";
import { Card } from "@/components/ui/Card";
import { ProductsManager } from "@/components/dashboard/ProductsManager";

export const metadata = { title: "Products — CurateCo" };

export default async function BrandProductsPage() {
  const { supabase, brand } = await getCurrentBrandOrRedirect();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, base_price, selling_price, stock, images, status, rejection_reason")
    .eq("brand_id", brand.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-[#1A1A1A]">Products</h1>
        <p className="text-sm text-text-secondary">Manage your product catalog and stock levels.</p>
      </div>
      <Card className="p-6">
        <ProductsManager initialProducts={products ?? []} />
      </Card>
    </div>
  );
}
