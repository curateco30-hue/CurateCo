import Image from "next/image";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { LogoutButton } from "@/components/layout/LogoutButton";
import { NotificationBell } from "@/components/dashboard/NotificationBell";

interface NavbarProps {
  displayName: string;
  photoUrl?: string | null;
  unreadNotifications?: number;
}

function Navbar({ displayName, photoUrl, unreadNotifications = 0 }: NavbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6">
      <Link href="/" className="flex items-center">
        <Image src="/logo.svg" alt="CurateCo" width={120} height={30} />
      </Link>
      <div className="flex items-center gap-4">
        <NotificationBell unreadCount={unreadNotifications} />
        <div className="flex items-center gap-2.5">
          <Avatar name={displayName} src={photoUrl} size="sm" />
          <span className="hidden text-sm font-medium text-[#1A1A1A] sm:inline">{displayName}</span>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}

export { Navbar };
