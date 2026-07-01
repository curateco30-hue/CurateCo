import { getCurrentAdminOrRedirect } from "@/lib/queries/admin";
import { Card } from "@/components/ui/Card";
import { UserManagementTable } from "@/components/dashboard/UserManagementTable";

export const metadata = { title: "Curators — CurateCo Admin" };

export default async function AdminCuratorsPage() {
  const { supabase } = await getCurrentAdminOrRedirect();

  const { data } = await supabase
    .from("curators")
    .select("id, profile_id, brand_name, is_suspended, created_at, profiles(email)")
    .order("created_at", { ascending: false });

  const users = (data ?? []).map((c) => ({
    id: c.id,
    profileId: c.profile_id ?? "",
    name: c.brand_name,
    email: (c.profiles as unknown as { email: string } | null)?.email ?? "—",
    joinDate: c.created_at,
    isSuspended: c.is_suspended,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-[#1A1A1A]">Curators</h1>
        <p className="text-sm text-text-secondary">Manage curator accounts on the platform.</p>
      </div>
      <Card className="p-2 sm:p-4">
        <UserManagementTable initialUsers={users} table="curators" />
      </Card>
    </div>
  );
}
