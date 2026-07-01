import { LayoutDashboard, Package, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { getCurrentBrandOrRedirect } from "@/lib/queries/brand";

const links = [
  { href: "/brand/dashboard", label: "Dashboard", icon: <LayoutDashboard className="size-4.5" /> },
  { href: "/brand/products", label: "Products", icon: <Package className="size-4.5" /> },
  { href: "/brand/orders", label: "Orders", icon: <ShoppingBag className="size-4.5" /> },
];

export default async function BrandLayout({ children }: { children: React.ReactNode }) {
  const { brand } = await getCurrentBrandOrRedirect();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar displayName={brand.business_name} photoUrl={brand.logo_url} />
      <div className="flex flex-1">
        <Sidebar links={links} />
        <main className="flex-1 bg-beige p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
