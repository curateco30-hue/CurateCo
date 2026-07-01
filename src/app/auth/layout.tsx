import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-beige px-4 py-12">
      <Link href="/" className="mb-8 flex items-center">
        <Image src="/logo.svg" alt="CurateCo" width={160} height={40} priority />
      </Link>
      <div className="w-full max-w-xl rounded-2xl border border-border bg-white p-8 shadow-sm sm:p-10">
        {children}
      </div>
    </div>
  );
}
