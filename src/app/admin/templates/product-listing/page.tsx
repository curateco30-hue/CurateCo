import { getTemplateSettings } from "@/lib/queries/templates";
import { TemplateEditorShell } from "@/components/dashboard/TemplateEditorShell";
import type { JsonValue } from "@/components/dashboard/JsonSettingsForm";

export const metadata = { title: "Product Listing Template — CurateCo Admin" };

export default async function ProductListingTemplatePage() {
  const settings = await getTemplateSettings("product_listing");

  return (
    <TemplateEditorShell
      templateName="product_listing"
      title="Product Listing Template"
      description="Controls the platform product feed at /curator/products."
      initialSettings={settings as Record<string, JsonValue>}
    />
  );
}
