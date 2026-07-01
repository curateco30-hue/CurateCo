import { getCurrentAdminOrRedirect } from "@/lib/queries/admin";
import { Card } from "@/components/ui/Card";
import { UserManagementTable } from "@/components/dashboard/UserManagementTable";

export const metadata = { title: "Brands — CurateCo Admin" };

export default async function AdminBrandsPage() {
  const { supabase } = await getCurrentAdminOrRedirect();

  const { data } = await supabase
    .from("brands")
    .select("id, profile_id, business_name, is_suspended, created_at, profiles(email)")
    .order("created_at", { ascending: false });

  const users = (data ?? []).map((b) => ({
    id: b.id,
    profileId: b.profile_id ?? "",
    name: b.business_name,
    email: (b.profiles as unknown as { email: string } | null)?.email ?? "—",
    joinDate: b.created_at,
    isSuspended: b.is_suspended,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-[#1A1A1A]">Brands</h1>
        <p className="text-sm text-text-secondary">Manage certified brand accounts.</p>
      </div>
      <Card className="p-2 sm:p-4">
        <UserManagementTable initialUsers={users} table="brands" />
      </Card>
    </div>
  );
}
