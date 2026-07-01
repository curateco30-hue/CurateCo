import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Truck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Order Confirmed — CurateCo" };

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const refs = ref ? ref.split(",") : [];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-beige px-6 py-16 text-center">
      <Link href="/" className="mb-10">
        <Image src="/logo.svg" alt="CurateCo" width={140} height={35} />
      </Link>
      <Card className="w-full max-w-md p-8">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-pale">
          <CheckCircle2 className="size-7 text-brand" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-medium text-[#1A1A1A]">
          Order Confirmed
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Thank you for your order. Your curator has been notified and your items are being
          prepared.
        </p>

        {refs.length > 0 && (
          <div className="mt-5 rounded-xl border border-border bg-beige p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">
              {refs.length > 1 ? "Order References" : "Order Reference"}
            </p>
            <p className="mt-1 font-mono text-sm text-[#1A1A1A]">
              {refs.map((r) => r.slice(0, 8).toUpperCase()).join(", ")}
            </p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-text-secondary">
          <Truck className="size-4 text-brand" />
          Delivery is handled by DHL or GIG Logistics.
        </div>

        <Link href="/" className="mt-6 block">
          <Button variant="secondary" className="w-full">
            Continue Browsing
          </Button>
        </Link>
      </Card>
    </div>
  );
}
