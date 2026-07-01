import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getStoreBySlug } from "@/lib/queries/storefront";
import { getTemplateSettings } from "@/lib/queries/templates";
import { logAnalyticsEvent } from "@/lib/actions/analytics";
import { ProductGallery } from "@/components/store/ProductGallery";
import { ProductDetailActions } from "@/components/store/ProductDetailActions";
import { FeaturedVideo } from "@/components/store/FeaturedVideo";
import { WhyCuratedBlock } from "@/components/store/WhyCuratedBlock";
import { formatNaira } from "@/lib/utils";

interface ProductDetailSettings {
  whyCurated?: { sectionTitle?: string; backgroundColor?: string; fontStyle?: string };
  sizeLabel?: string;
  colorLabel?: string;
  stockLabel?: string;
  addToCartLabel?: string;
  shippingNote?: string;
  relatedProducts?: { show?: boolean; sectionHeading?: string };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();

  const [settings, { data: storeProduct }] = await Promise.all([
    getTemplateSettings("product_detail") as Promise<ProductDetailSettings>,
    store.supabase
      .from("curator_store_products")
      .select(
        "id, product_id, curator_commission_pct, why_curated_note, products(name, description, base_price, selling_price, images, sizes, colors, stock, brand_id)",
      )
      .eq("store_id", store.id)
      .eq("product_id", id)
      .single(),
  ]);

  if (!storeProduct) notFound();

  const product = storeProduct.products as unknown as {
    name: string;
    description: string | null;
    base_price: number;
    selling_price: number;
    images: string[] | null;
    sizes: string[] | null;
    colors: string[] | null;
    stock: number;
    brand_id: string;
  };

  // brands RLS only allows owner-or-admin reads, so the brand name for a
  // public storefront visitor comes from the public-safe view instead.
  const [{ data: brandProfile }, { data: relatedRaw }] = await Promise.all([
    store.supabase.from("brand_public_profile").select("business_name").eq("id", product.brand_id).single(),
    store.supabase
      .from("curator_store_products")
      .select("id, product_id, curator_commission_pct, products(name, images, selling_price)")
      .eq("store_id", store.id)
      .neq("product_id", id)
      .limit(2),
    logAnalyticsEvent({
      eventType: "product_view",
      storeId: store.id,
      productId: id,
      curatorId: store.curatorId,
    }),
  ]);
  const brandName = brandProfile?.business_name ?? "—";
  const finalPrice = product.selling_price * (1 + storeProduct.curator_commission_pct / 100);

  const related = (relatedRaw ?? []).map((r) => {
    const p = r.products as unknown as { name: string; images: string[] | null; selling_price: number } | null;
    const sellingPrice = p?.selling_price ?? 0;
    return {
      id: r.product_id,
      name: p?.name ?? "—",
      image: p?.images?.[0] ?? null,
      price: sellingPrice * (1 + r.curator_commission_pct / 100),
    };
  });

  const isFeaturedVideoProduct = store.featuredVideoProductId === id && store.featuredVideoUrl;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 sm:px-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images ?? []} name={product.name} />

        <div>
          <p className="text-xs text-text-muted">{brandName}</p>
          <h1 className="mt-1 font-display text-2xl font-medium text-[#1A1A1A]">{product.name}</h1>
          <p className="mt-2 text-xl font-semibold text-brand">{formatNaira(finalPrice)}</p>
          {product.description && (
            <p className="mt-4 text-sm text-text-secondary">{product.description}</p>
          )}

          <div className="mt-6">
            <ProductDetailActions
              storeSlug={slug}
              storeProductId={storeProduct.id}
              productId={id}
              name={product.name}
              price={finalPrice}
              image={product.images?.[0] ?? null}
              sizes={product.sizes ?? []}
              colors={product.colors ?? []}
              stock={product.stock}
              curatorCommissionPct={storeProduct.curator_commission_pct}
              sizeLabel={settings.sizeLabel || "Size"}
              colorLabel={settings.colorLabel || "Color"}
              stockLabel={settings.stockLabel || "In Stock"}
              addToCartLabel={settings.addToCartLabel || "Add to Cart"}
              shippingNote={settings.shippingNote || "Delivery handled by DHL or GIG Logistics."}
            />
          </div>
        </div>
      </div>

      {isFeaturedVideoProduct && (
        <div className="mt-10">
          <FeaturedVideo
            videoUrl={store.featuredVideoUrl as string}
            productName={product.name}
            sectionTitle="Featured Pick"
          />
        </div>
      )}

      {storeProduct.why_curated_note && (
        <div className="mt-10">
          <WhyCuratedBlock
            note={storeProduct.why_curated_note}
            curatorName={store.brandName}
            curatorPhotoUrl={store.profilePhotoUrl}
            sectionTitle={settings.whyCurated?.sectionTitle || "Why I Curated This"}
            backgroundColor={settings.whyCurated?.backgroundColor || "#F7E8EC"}
            isItalic={settings.whyCurated?.fontStyle !== "normal"}
          />
        </div>
      )}

      {settings.relatedProducts?.show !== false && related.length > 0 && (
        <div className="mt-10">
          <p className="mb-4 font-display text-xl font-medium text-[#1A1A1A]">
            {settings.relatedProducts?.sectionHeading || "You May Also Like"}
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link key={r.id} href={`/store/${slug}/product/${r.id}`} className="group">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-beige">
                  {r.image && (
                    <Image
                      src={r.image}
                      alt={r.name}
                      fill
                      sizes="200px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <p className="mt-2 text-sm font-medium text-[#1A1A1A]">{r.name}</p>
                <p className="text-xs text-text-muted">{formatNaira(r.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
