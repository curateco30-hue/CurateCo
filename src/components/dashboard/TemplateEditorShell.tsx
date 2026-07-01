"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { JsonSettingsForm, type JsonValue } from "@/components/dashboard/JsonSettingsForm";
import { StorefrontPreview } from "@/components/dashboard/previews/StorefrontPreview";
import { ProductListingPreview } from "@/components/dashboard/previews/ProductListingPreview";
import { ProductDetailPreview } from "@/components/dashboard/previews/ProductDetailPreview";
import type { TemplateName } from "@/types/database";

interface TemplateEditorShellProps {
  templateName: TemplateName;
  title: string;
  description: string;
  initialSettings: Record<string, JsonValue>;
}

function TemplateEditorShell({
  templateName,
  title,
  description,
  initialSettings,
}: TemplateEditorShellProps) {
  const supabase = createClient();
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const isDirty = JSON.stringify(settings) !== JSON.stringify(initialSettings);

  const publish = async () => {
    setIsSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("template_settings")
      .update({ settings, updated_by: user?.id })
      .eq("template_name", templateName);
    setIsSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Template published.");
  };

  const discard = () => setSettings(initialSettings);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-medium text-[#1A1A1A]">{title}</h1>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={discard} disabled={!isDirty}>
            Discard Changes
          </Button>
          <Button onClick={publish} isLoading={isSaving} disabled={!isDirty}>
            Publish
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="max-h-[70vh] overflow-y-auto p-6">
          <JsonSettingsForm value={settings} onChange={setSettings} />
        </Card>
        <div className="lg:sticky lg:top-6 lg:self-start">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-muted">
            Live Preview
          </p>
          {templateName === "storefront" && <StorefrontPreview settings={settings} />}
          {templateName === "product_listing" && <ProductListingPreview settings={settings} />}
          {templateName === "product_detail" && <ProductDetailPreview settings={settings} />}
        </div>
      </div>
    </div>
  );
}

export { TemplateEditorShell };
