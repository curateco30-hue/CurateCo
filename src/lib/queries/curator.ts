import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentCuratorOrRedirect() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  if (!profile || profile.role !== "curator") redirect("/auth/login");

  const { data: curator } = await supabase
    .from("curators")
    .select("*")
    .eq("profile_id", user.id)
    .single();

  if (!curator) redirect("/auth/login");

  const { data: store } = await supabase
    .from("curator_stores")
    .select("*")
    .eq("curator_id", curator.id)
    .single();

  if (!store) redirect("/auth/login");

  return { supabase, user, curator, store };
}
