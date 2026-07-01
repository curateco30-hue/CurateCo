import { getCurrentCuratorOrRedirect } from "@/lib/queries/curator";
import { Card } from "@/components/ui/Card";
import { StoreEditForm } from "@/components/curator/StoreEditForm";

export const metadata = { title: "Edit Store — CurateCo" };

export default async function CuratorStoreEditPage() {
  const { curator, store } = await getCurrentCuratorOrRedirect();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-[#1A1A1A]">Edit Storefront</h1>
        <p className="text-sm text-text-secondary">
          Your brand name is set at signup. You control everything else your customers read.
        </p>
      </div>
      <Card className="p-6">
        <StoreEditForm
          storeId={store.id}
          brandName={curator.brand_name}
          initialPrefix={store.intro_headline_prefix}
          initialIntroText={store.intro_text ?? ""}
        />
      </Card>
    </div>
  );
}
