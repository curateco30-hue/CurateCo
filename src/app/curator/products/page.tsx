import { getCurrentCuratorOrRedirect } from "@/lib/queries/curator";
import { getTemplateSettings } from "@/lib/queries/templates";
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
  const settings = (await getTemplateSettings("product_listing")) as ProductListingSettings;

  const [{ data: products }, { count: storeProductCount }, { data: videoStores }] = await Promise.all([
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
      .from("curator_stores")
      .select("store_slug, featured_video_url, curator_id")
      .not("featured_video_url", "is", null)
      .eq("is_active", true),
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

  const curatorIds = [...new Set((videoStores ?? []).map((s) => s.curator_id))];
  const { data: curatorProfiles } = curatorIds.length
    ? await supabase.from("curator_public_profile").select("id, brand_name").in("id", curatorIds)
    : { data: [] as { id: string; brand_name: string }[] };
  const curatorNameById = new Map((curatorProfiles ?? []).map((c) => [c.id, c.brand_name]));

  const videos: VideoStore[] = (videoStores ?? [])
    .map((s) => ({
      storeSlug: s.store_slug,
      brandName: curatorNameById.get(s.curator_id) ?? "Curator",
      videoUrl: s.featured_video_url as string,
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
        showBrandName={settings.productCard?.showBrandName !== false}
        showCommissionCap={settings.productCard?.showCommissionCap !== false}
        commissionCapLabel={settings.productCard?.commissionCapLabel || "Commission Cap"}
        addToStoreLabel={settings.addToStoreLabel || "Add to Store"}
        emptyStateMessage={settings.emptyStateMessage || "No approved products yet — check back soon."}
      />
    </div>
  );
}
