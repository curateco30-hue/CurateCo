import { getTemplateSettings } from "@/lib/queries/templates";
import { TemplateEditorShell } from "@/components/dashboard/TemplateEditorShell";
import type { JsonValue } from "@/components/dashboard/JsonSettingsForm";

export const metadata = { title: "Storefront Template — CurateCo Admin" };

export default async function StorefrontTemplatePage() {
  const settings = await getTemplateSettings("storefront");

  return (
    <TemplateEditorShell
      templateName="storefront"
      title="Storefront Template"
      description="Controls every curator's public storefront at /store/[slug]."
      initialSettings={settings as Record<string, JsonValue>}
    />
  );
}
