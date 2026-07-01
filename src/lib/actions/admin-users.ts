"use server";

import { getCurrentAdminOrRedirect } from "@/lib/queries/admin";
import { createServiceClient } from "@/lib/supabase/server";

/** Permanently removes a user account (auth user + cascaded profile/curator/brand rows). */
export async function removeUserAccount(profileId: string) {
  await getCurrentAdminOrRedirect();
  const service = createServiceClient();
  const { error } = await service.auth.admin.deleteUser(profileId);
  if (error) throw new Error(error.message);
}
