import { createClient } from "@/lib/supabase/server";
import type { TemplateName } from "@/types/database";

export async function getTemplateSettings(templateName: TemplateName) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("template_settings")
    .select("settings")
    .eq("template_name", templateName)
    .single();
  return data?.settings ?? {};
}
