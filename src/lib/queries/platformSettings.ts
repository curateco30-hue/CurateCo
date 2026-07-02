import { createClient } from "@/lib/supabase/server";

export async function getMaxStoreProducts(): Promise<number> {
  const supabase = await createClient();
  const { data } = await supabase.from("platform_settings").select("max_store_products").limit(1).maybeSingle();
  return data?.max_store_products ?? 3;
}
