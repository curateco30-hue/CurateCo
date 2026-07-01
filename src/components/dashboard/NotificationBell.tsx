import { Bell } from "lucide-react";

interface NotificationBellProps {
  unreadCount?: number;
}

function NotificationBell({ unreadCount = 0 }: NotificationBellProps) {
  return (
    <button
      aria-label="Notifications"
      className="relative rounded-full p-2 text-text-secondary transition-all duration-300 ease-in-out hover:bg-beige hover:text-[#1A1A1A]"
    >
      <Bell className="size-5" />
      {unreadCount > 0 && (
        <span className="absolute right-1.5 top-1.5 flex size-2 rounded-full bg-brand" />
      )}
    </button>
  );
}

export { NotificationBell };
