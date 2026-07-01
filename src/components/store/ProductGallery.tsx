"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const shown = images.length > 0 ? images : [null];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-beige">
        {shown[active] && (
          <Image
            src={shown[active] as string}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        )}
      </div>
      {shown.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {shown.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border-2",
                active === i ? "border-brand" : "border-transparent",
              )}
            >
              {img && <Image src={img} alt={`${name} ${i + 1}`} fill sizes="64px" className="object-cover" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export { ProductGallery };
