import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// TEMPORARY diagnostic route — remove once the production 404 is resolved.
export async function GET() {
  const supabase = await createClient();

  const { data, error, status, statusText } = await supabase
    .from("curator_stores")
    .select("id, store_slug, is_active")
    .eq("store_slug", "debbie")
    .eq("is_active", true)
    .single();

  const { count: totalRows, error: countError } = await supabase
    .from("curator_stores")
    .select("*", { count: "exact", head: true });

  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length ?? 0,
    anonKeyTail: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(-12) ?? null,
    query: { data, error, status, statusText },
    totalStoreRowsVisible: { totalRows, countError },
  });
}
