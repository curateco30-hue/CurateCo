import {
  LayoutDashboard,
  PackageSearch,
  Users,
  Store,
  ShoppingBag,
  Boxes,
  MessagesSquare,
  LayoutTemplate,
  Settings,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { getCurrentAdminOrRedirect } from "@/lib/queries/admin";

const links = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="size-4.5" /> },
  { href: "/admin/products", label: "Products", icon: <PackageSearch className="size-4.5" /> },
  { href: "/admin/curators", label: "Curators", icon: <Users className="size-4.5" /> },
  { href: "/admin/brands", label: "Brands", icon: <Store className="size-4.5" /> },
  { href: "/admin/orders", label: "Orders", icon: <ShoppingBag className="size-4.5" /> },
  { href: "/admin/inventory", label: "Inventory", icon: <Boxes className="size-4.5" /> },
  { href: "/admin/support", label: "Support", icon: <MessagesSquare className="size-4.5" /> },
  { href: "/admin/templates", label: "Templates", icon: <LayoutTemplate className="size-4.5" /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings className="size-4.5" /> },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await getCurrentAdminOrRedirect();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar displayName="CurateCo Admin" />
      <div className="flex flex-1">
        <Sidebar links={links} />
        <main className="flex-1 bg-beige p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
