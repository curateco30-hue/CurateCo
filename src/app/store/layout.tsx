import Image from "next/image";
import Link from "next/link";
import { CartButton } from "@/components/store/CartButton";
import { CartDrawer } from "@/components/store/CartDrawer";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex items-center justify-between border-b border-border px-6 py-4 sm:px-12">
        <Link href="/">
          <Image src="/logo.svg" alt="CurateCo" width={120} height={30} />
        </Link>
        <CartButton />
      </header>
      <main className="flex-1">{children}</main>
      <CartDrawer />
    </div>
  );
}
