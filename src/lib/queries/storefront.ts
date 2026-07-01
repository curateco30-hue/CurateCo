import { createClient } from "@/lib/supabase/server";

export async function getStoreBySlug(slug: string) {
  const supabase = await createClient();

  const { data: store } = await supabase
    .from("curator_stores")
    .select(
      "id, curator_id, store_slug, intro_headline_prefix, intro_text, featured_video_url, featured_video_product_id",
    )
    .eq("store_slug", slug)
    .eq("is_active", true)
    .single();

  if (!store) return null;

  // curators RLS only allows owner-or-admin reads, so a public storefront
  // visitor's curator info comes from the public-safe view instead of an
  // embedded join (which silently returns null for anonymous requests).
  const { data: curatorInfo } = await supabase
    .from("curator_public_profile")
    .select("brand_name, brand_color, profile_photo_url")
    .eq("id", store.curator_id)
    .single();

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
