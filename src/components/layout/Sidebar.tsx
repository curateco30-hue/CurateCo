"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SidebarLink {
  href: string;
  label: string;
  icon: ReactNode;
}

interface SidebarProps {
  links: SidebarLink[];
}

function Sidebar({ links }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-1 border-r border-border bg-white p-4 sm:flex">
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out",
              isActive
                ? "bg-brand-pale text-brand"
                : "text-text-secondary hover:bg-beige hover:text-[#1A1A1A]",
            )}
          >
            {link.icon}
            {link.label}
          </Link>
        );
      })}
    </aside>
  );
}

export { Sidebar };
export type { SidebarLink };
