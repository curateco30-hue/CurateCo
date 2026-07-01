import { getCurrentCuratorOrRedirect } from "@/lib/queries/curator";
import { StoreManager } from "@/components/curator/StoreManager";

export const metadata = { title: "My Store — CurateCo" };

export default async function CuratorStorePage() {
  const { supabase, store } = await getCurrentCuratorOrRedirect();

  const { data } = await supabase
    .from("curator_store_products")
    .select("id, product_id, curator_commission_pct, why_curated_note, products(name, images, selling_price)")
    .eq("store_id", store.id)
    .order("added_at", { ascending: true });

  const storeProducts = (data ?? []).map((sp) => {
    const product = sp.products as unknown as {
      name: string;
      images: string[] | null;
      selling_price: number;
    } | null;
    return {
      id: sp.id,
      productId: sp.product_id,
      name: product?.name ?? "—",
      image: product?.images?.[0] ?? null,
      sellingPrice: product?.selling_price ?? 0,
      commissionPct: sp.curator_commission_pct,
      whyCuratedNote: sp.why_curated_note,
    };
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-[#1A1A1A]">My Store</h1>
        <p className="text-sm text-text-secondary">
          Manage the products, notes, and featured video on your storefront.
        </p>
      </div>
      <StoreManager
        storeId={store.id}
        storeSlug={store.store_slug}
        storeProducts={storeProducts}
        featuredVideoUrl={store.featured_video_url}
        featuredVideoProductId={store.featured_video_product_id}
      />
    </div>
  );
}
