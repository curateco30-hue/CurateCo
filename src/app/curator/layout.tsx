import { LayoutDashboard, PackageSearch, Store } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { getCurrentCuratorOrRedirect } from "@/lib/queries/curator";

const links = [
  { href: "/curator/dashboard", label: "Dashboard", icon: <LayoutDashboard className="size-4.5" /> },
  { href: "/curator/products", label: "Browse Products", icon: <PackageSearch className="size-4.5" /> },
  { href: "/curator/store", label: "My Store", icon: <Store className="size-4.5" /> },
];

export default async function CuratorLayout({ children }: { children: React.ReactNode }) {
  const { curator } = await getCurrentCuratorOrRedirect();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar displayName={curator.brand_name} photoUrl={curator.profile_photo_url} />
      <div className="flex flex-1">
        <Sidebar links={links} />
        <main className="flex-1 bg-beige p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
