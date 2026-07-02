import { getCurrentCuratorOrRedirect } from "@/lib/queries/curator";
import { getMaxStoreProducts } from "@/lib/queries/platformSettings";
import { StoreManager } from "@/components/curator/StoreManager";

export const metadata = { title: "My Store — CurateCo" };

export default async function CuratorStorePage() {
  const { supabase, store } = await getCurrentCuratorOrRedirect();

  const [{ data: productRows }, { data: videoRows }, maxStoreProducts] = await Promise.all([
    supabase
      .from("curator_store_products")
      .select("id, product_id, curator_commission_pct, why_curated_note, products(name, images, selling_price)")
      .eq("store_id", store.id)
      .order("added_at", { ascending: true }),
    supabase
      .from("curator_store_videos")
      .select("id, video_url, product_id, products(name)")
      .eq("store_id", store.id)
      .order("created_at", { ascending: true }),
    getMaxStoreProducts(),
  ]);

  const storeProducts = (productRows ?? []).map((sp) => {
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

  const videos = (videoRows ?? []).map((v) => ({
    id: v.id,
    videoUrl: v.video_url,
    productId: v.product_id,
    productName: (v.products as unknown as { name: string } | null)?.name ?? null,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-[#1A1A1A]">My Store</h1>
        <p className="text-sm text-text-secondary">
          Manage the products, notes, and featured videos on your storefront.
        </p>
      </div>
      <StoreManager
        storeId={store.id}
        storeSlug={store.store_slug}
        storeProducts={storeProducts}
        videos={videos}
        maxVideos={maxStoreProducts}
      />
    </div>
  );
}
