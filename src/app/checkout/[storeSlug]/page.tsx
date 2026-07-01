import { notFound } from "next/navigation";
import Image from "next/image";
import { getStoreBySlug } from "@/lib/queries/storefront";
import { CheckoutForm } from "@/components/store/CheckoutForm";

export const metadata = { title: "Checkout — CurateCo" };

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;
  const store = await getStoreBySlug(storeSlug);
  if (!store) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:px-12">
      <div className="mb-8 flex items-center gap-3">
        <Image src="/logo.svg" alt="CurateCo" width={120} height={30} />
        <span className="text-sm text-text-muted">
          Checking out from {store.introHeadlinePrefix} {store.brandName}
        </span>
      </div>
      <CheckoutForm storeSlug={storeSlug} />
    </div>
  );
}
