import { getCurrentAdminOrRedirect } from "@/lib/queries/admin";
import { Card } from "@/components/ui/Card";
import { PlatformSettingsForm } from "@/components/dashboard/PlatformSettingsForm";

export const metadata = { title: "Platform Settings — CurateCo Admin" };

export default async function AdminSettingsPage() {
  const { supabase } = await getCurrentAdminOrRedirect();

  const { data } = await supabase.from("platform_settings").select("max_store_products").limit(1).maybeSingle();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-[#1A1A1A]">Platform Settings</h1>
        <p className="text-sm text-text-secondary">Limits that apply across every curator storefront.</p>
      </div>
      <Card className="max-w-md p-6">
        <PlatformSettingsForm initialMaxStoreProducts={data?.max_store_products ?? 3} />
      </Card>
    </div>
  );
}
