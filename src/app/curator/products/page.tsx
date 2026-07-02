import { getCurrentCuratorOrRedirect } from "@/lib/queries/curator";
import { getTemplateSettings } from "@/lib/queries/templates";
import { getMaxStoreProducts } from "@/lib/queries/platformSettings";
import { CuratorVideoShowcase, type VideoStore } from "@/components/curator/CuratorVideoShowcase";
import { ProductGrid } from "@/components/curator/ProductGrid";

export const metadata = { title: "Products — CurateCo" };

interface ProductListingSettings {
  headline?: string;
  subheadline?: string;
  video?: { sectionTitle?: string };
  productCard?: {
    showBrandName?: boolean;
    showCommissionCap?: boolean;
    commissionCapLabel?: string;
  };
  addToStoreLabel?: string;
  emptyStateMessage?: string;
}

export default async function CuratorProductsPage() {
  const { supabase, store } = await getCurrentCuratorOrRedirect();

  const [settings, maxStoreProducts, { data: products }, { count: storeProductCount }, { data: videoRows }] =
    await Promise.all([
      getTemplateSettings("product_listing") as Promise<ProductListingSettings>,
      getMaxStoreProducts(),
      supabase
        .from("products")
        .select(
          "id, name, brand_id, base_price, curateco_commission_pct, max_curator_commission_cap_pct, selling_price, images",
        )
        .eq("status", "approved")
        .eq("is_visible", true)
        .order("created_at", { ascending: false }),
      supabase
        .from("curator_store_products")
        .select("*", { count: "exact", head: true })
        .eq("store_id", store.id),
      supabase
        .from("curator_store_videos")
        .select("video_url, curator_stores!inner(store_slug, curator_id, is_active)")
        .eq("curator_stores.is_active", true),
    ]);

  // brands/curators RLS only allows owner-or-admin reads, so brand/curator
  // names for other accounts come from the public-safe views instead.
  const brandIds = [...new Set((products ?? []).map((p) => p.brand_id))];
  const { data: brandProfiles } = brandIds.length
    ? await supabase.from("brand_public_profile").select("id, business_name").in("id", brandIds)
    : { data: [] as { id: string; business_name: string }[] };
  const brandNameById = new Map((brandProfiles ?? []).map((b) => [b.id, b.business_name]));

  const flatProducts = (products ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    base_price: p.base_price,
    curateco_commission_pct: p.curateco_commission_pct,
    max_curator_commission_cap_pct: p.max_curator_commission_cap_pct,
    selling_price: p.selling_price,
    images: p.images,
    brand_name: brandNameById.get(p.brand_id) ?? "—",
  }));

  const flatVideos = (videoRows ?? []).map((v) => {
    const s = v.curator_stores as unknown as { store_slug: string; curator_id: string } | null;
    return { storeSlug: s?.store_slug ?? "", curatorId: s?.curator_id ?? "", videoUrl: v.video_url };
  });

  const curatorIds = [...new Set(flatVideos.map((v) => v.curatorId))];
  const { data: curatorProfiles } = curatorIds.length
    ? await supabase.from("curator_public_profile").select("id, brand_name").in("id", curatorIds)
    : { data: [] as { id: string; brand_name: string }[] };
  const curatorNameById = new Map((curatorProfiles ?? []).map((c) => [c.id, c.brand_name]));

  // One video per curator, then randomly pick up to 3 curators to showcase.
  const oneVideoPerCurator = new Map<string, (typeof flatVideos)[number]>();
  for (const v of flatVideos.sort(() => Math.random() - 0.5)) {
    if (!oneVideoPerCurator.has(v.curatorId)) oneVideoPerCurator.set(v.curatorId, v);
  }

  const videos: VideoStore[] = Array.from(oneVideoPerCurator.values())
    .map((v) => ({
      storeSlug: v.storeSlug,
      brandName: curatorNameById.get(v.curatorId) ?? "Curator",
      videoUrl: v.videoUrl,
    }))
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-medium text-[#1A1A1A]">
          {settings.headline || "Discover Products"}
        </h1>
        <p className="text-sm text-text-secondary">
          {settings.subheadline || "Browse certified-brand pieces ready to add to your store."}
        </p>
      </div>

      <CuratorVideoShowcase title={settings.video?.sectionTitle || "Curated By Voices Like Yours"} videos={videos} />

      <ProductGrid
        products={flatProducts}
        storeId={store.id}
        storeProductCount={storeProductCount ?? 0}
        maxStoreProducts={maxStoreProducts}
        showBrandName={settings.productCard?.showBrandName !== false}
        showCommissionCap={settings.productCard?.showCommissionCap !== false}
        commissionCapLabel={settings.productCard?.commissionCapLabel || "Commission Cap"}
        addToStoreLabel={settings.addToStoreLabel || "Add to Store"}
        emptyStateMessage={settings.emptyStateMessage || "No approved products yet — check back soon."}
      />
    </div>
  );
}
