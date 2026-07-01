import { getTemplateSettings } from "@/lib/queries/templates";
import { TemplateEditorShell } from "@/components/dashboard/TemplateEditorShell";
import type { JsonValue } from "@/components/dashboard/JsonSettingsForm";

export const metadata = { title: "Product Detail Template — CurateCo Admin" };

export default async function ProductDetailTemplatePage() {
  const settings = await getTemplateSettings("product_detail");

  return (
    <TemplateEditorShell
      templateName="product_detail"
      title="Product Detail Template"
      description="Controls individual product pages at /store/[slug]/product/[id]."
      initialSettings={settings as Record<string, JsonValue>}
    />
  );
}
