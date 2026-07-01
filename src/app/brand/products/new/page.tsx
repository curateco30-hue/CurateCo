import { getCurrentBrandOrRedirect } from "@/lib/queries/brand";
import { Card } from "@/components/ui/Card";
import { ProductUploadForm } from "@/components/dashboard/ProductUploadForm";

export const metadata = { title: "Upload Product — CurateCo" };

export default async function NewProductPage() {
  const { brand } = await getCurrentBrandOrRedirect();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-[#1A1A1A]">Upload a Product</h1>
        <p className="text-sm text-text-secondary">
          New products are reviewed by CurateCo before they appear to curators.
        </p>
      </div>
      <Card className="p-6">
        <ProductUploadForm brandId={brand.id} />
      </Card>
    </div>
  );
}
