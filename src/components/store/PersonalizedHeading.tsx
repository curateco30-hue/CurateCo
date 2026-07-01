"use client";

import { useCustomerNameStore } from "@/lib/store/customerName";

interface PersonalizedHeadingProps {
  storeSlug: string;
  fallback: string;
  className?: string;
}

function PersonalizedHeading({ storeSlug, fallback, className }: PersonalizedHeadingProps) {
  const name = useCustomerNameStore((s) => s.names[storeSlug]);

  return (
    <p className={className}>
      {name ? (
        <>
          {name}, you&apos;re welcome to shop my taste 🤭
        </>
      ) : (
        fallback
      )}
    </p>
  );
}

export { PersonalizedHeading };
