import { getCurrentAdminOrRedirect } from "@/lib/queries/admin";
import { SupportInbox } from "@/components/dashboard/SupportInbox";

export const metadata = { title: "Support — CurateCo Admin" };

export default async function AdminSupportPage() {
  const { supabase } = await getCurrentAdminOrRedirect();

  const { data } = await supabase
    .from("support_messages")
    .select("id, sender_name, sender_email, message, is_read, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-[#1A1A1A]">Support Messages</h1>
        <p className="text-sm text-text-secondary">Messages submitted through the support form.</p>
      </div>
      <SupportInbox initialMessages={data ?? []} />
    </div>
  );
}
