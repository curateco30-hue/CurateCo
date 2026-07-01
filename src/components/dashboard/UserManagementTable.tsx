"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { toast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { removeUserAccount } from "@/lib/actions/admin-users";

interface ManagedUser {
  id: string;
  profileId: string;
  name: string;
  email: string;
  joinDate: string;
  isSuspended: boolean;
}

interface UserManagementTableProps {
  initialUsers: ManagedUser[];
  table: "curators" | "brands";
}

function UserManagementTable({ initialUsers, table }: UserManagementTableProps) {
  const supabase = createClient();
  const [users, setUsers] = useState(initialUsers);
  const [busyId, setBusyId] = useState<string | null>(null);

  const toggleSuspend = async (user: ManagedUser) => {
    setBusyId(user.id);
    const { error } = await supabase
      .from(table)
      .update({ is_suspended: !user.isSuspended })
      .eq("id", user.id);
    setBusyId(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, isSuspended: !u.isSuspended } : u)),
    );
    toast.success(user.isSuspended ? "Account restored." : "Account suspended.");
  };

  const remove = async (user: ManagedUser) => {
    if (!confirm(`Permanently remove ${user.name}? This cannot be undone.`)) return;
    setBusyId(user.id);
    try {
      await removeUserAccount(user.profileId);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast.success("Account removed.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove account.");
    } finally {
      setBusyId(null);
    }
  };

  if (users.length === 0) {
    return <p className="py-16 text-center text-sm text-text-muted">No accounts yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-text-muted">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Joined</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-border last:border-0">
              <td className="flex items-center gap-3 px-4 py-3">
                <Avatar name={user.name} size="sm" />
                <span className="font-medium text-[#1A1A1A]">{user.name}</span>
              </td>
              <td className="px-4 py-3 text-text-secondary">{user.email}</td>
              <td className="px-4 py-3 text-text-secondary">
                {new Date(user.joinDate).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-3">
                <Badge status={user.isSuspended ? "suspended" : "active"} />
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    isLoading={busyId === user.id}
                    onClick={() => toggleSuspend(user)}
                  >
                    {user.isSuspended ? "Restore" : "Suspend"}
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    isLoading={busyId === user.id}
                    onClick={() => remove(user)}
                  >
                    Remove
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { UserManagementTable };
export type { ManagedUser };
