import { notFound } from "next/navigation";
import { getStoreBySlug } from "@/lib/queries/storefront";
import { getTemplateSettings } from "@/lib/queries/templates";
import { logAnalyticsEvent } from "@/lib/actions/analytics";
import { StorefrontHero } from "@/components/store/StorefrontHero";
import { FeaturedVideo } from "@/components/store/FeaturedVideo";
import { ProductCard } from "@/components/store/ProductCard";

interface StorefrontSettings {
  hero?: { overlayOpacity?: number; minHeightDesktop?: string; minHeightMobile?: string; headingFontSize?: string };
  intro?: { label?: string };
  featuredVideo?: { sectionTitle?: string };
  productCollection?: { sectionHeading?: string; gridColumns?: number };
  footer?: { text?: string };
  global?: { addToCartLabel?: string };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) return { title: "Store Not Found — CurateCo" };
  return { title: `${store.introHeadlinePrefix} ${store.brandName} — CurateCo` };
}

export default async function StorefrontPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();

  const settings = (await getTemplateSettings("storefront")) as StorefrontSettings;

  const { data: storeProducts } = await store.supabase
    .from("curator_store_products")
    .select("id, product_id, curator_commission_pct, products(name, images, selling_price, sizes, colors)")
    .eq("store_id", store.id)
    .order("added_at", { ascending: true });

  await logAnalyticsEvent({ eventType: "store_view", storeId: store.id, curatorId: store.curatorId });

  const products = (storeProducts ?? []).map((sp) => {
    const product = sp.products as unknown as {
      name: string;
      images: string[] | null;
      selling_price: number;
      sizes: string[] | null;
      colors: string[] | null;
    } | null;
    const sellingPrice = product?.selling_price ?? 0;
    return {
      storeProductId: sp.id,
      productId: sp.product_id,
      name: product?.name ?? "—",
      image: product?.images?.[0] ?? null,
      price: sellingPrice * (1 + sp.curator_commission_pct / 100),
      sizes: product?.sizes ?? null,
      colors: product?.colors ?? null,
      curatorCommissionPct: sp.curator_commission_pct,
    };
  });

  const featuredProductName =
    store.featuredVideoProductId != null
      ? products.find((p) => p.productId === store.featuredVideoProductId)?.name ?? null
      : null;

  return (
    <div>
      <StorefrontHero
        photoUrl={store.profilePhotoUrl}
        brandColor={store.brandColor}
        headline={`${store.introHeadlinePrefix} ${store.brandName}`}
        settings={settings.hero ?? {}}
      />

      {store.introText && (
        <div className="px-6 py-10 sm:px-12">
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
            {settings.intro?.label ?? "About"}
          </p>
          <p className="mt-2 max-w-2xl text-base text-text-secondary">{store.introText}</p>
        </div>
      )}

      {store.featuredVideoUrl && (
        <FeaturedVideo
          videoUrl={store.featuredVideoUrl}
          productName={featuredProductName}
          sectionTitle={settings.featuredVideo?.sectionTitle ?? "Featured Pick"}
        />
      )}

      <div className="px-6 py-10 sm:px-12">
        <p className="mb-5 font-display text-2xl font-medium text-[#1A1A1A]">
          {settings.productCollection?.sectionHeading ?? "My Tastes"}
        </p>
        {products.length === 0 ? (
          <p className="text-sm text-text-muted">This curator hasn&apos;t added any products yet.</p>
        ) : (
          <div
            className="grid gap-5"
            style={{
              gridTemplateColumns: `repeat(${Math.min(settings.productCollection?.gridColumns ?? 3, products.length) || 1}, minmax(0, 1fr))`,
            }}
          >
            {products.map((product) => (
              <ProductCard
                key={product.storeProductId}
                storeSlug={store.slug}
                storeProductId={product.storeProductId}
                productId={product.productId}
                name={product.name}
                price={product.price}
                image={product.image}
                sizes={product.sizes}
                colors={product.colors}
                curatorCommissionPct={product.curatorCommissionPct}
                addToCartLabel={settings.global?.addToCartLabel ?? "Add to Cart"}
              />
            ))}
          </div>
        )}
      </div>

      {settings.footer?.text && (
        <div className="border-t border-border px-6 py-8 text-center sm:px-12">
          <p className="text-xs text-text-muted">{settings.footer.text}</p>
        </div>
      )}
    </div>
  );
}
