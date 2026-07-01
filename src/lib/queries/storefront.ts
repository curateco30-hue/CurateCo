import { createClient } from "@/lib/supabase/server";

export async function getStoreBySlug(slug: string) {
  const supabase = await createClient();

  const { data: store } = await supabase
    .from("curator_stores")
    .select(
      "id, curator_id, store_slug, intro_headline_prefix, intro_text, featured_video_url, featured_video_product_id, curators(brand_name, brand_color, profile_photo_url)",
    )
    .eq("store_slug", slug)
    .eq("is_active", true)
    .single();

  if (!store) return null;

  const curatorInfo = store.curators as unknown as {
    brand_name: string;
    brand_color: string;
    profile_photo_url: string | null;
  } | null;

  if (!curatorInfo) return null;

  return {
    supabase,
    id: store.id,
    curatorId: store.curator_id,
    slug: store.store_slug,
    introHeadlinePrefix: store.intro_headline_prefix,
    introText: store.intro_text,
    featuredVideoUrl: store.featured_video_url,
    featuredVideoProductId: store.featured_video_product_id,
    brandName: curatorInfo.brand_name,
    brandColor: curatorInfo.brand_color,
    profilePhotoUrl: curatorInfo.profile_photo_url,
  };
}
