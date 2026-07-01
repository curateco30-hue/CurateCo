"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-text-secondary transition-all duration-300 ease-in-out hover:bg-beige hover:text-[#1A1A1A]"
    >
      <LogOut className="size-4" />
      Log Out
    </button>
  );
}

export { LogoutButton };
