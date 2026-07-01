"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";

function CartButton() {
  const { items, openCart } = useCartStore();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <button
      onClick={openCart}
      aria-label="Open cart"
      className="relative rounded-full p-2 text-[#1A1A1A] transition-all duration-300 ease-in-out hover:bg-beige"
    >
      <ShoppingBag className="size-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex size-4.5 items-center justify-center rounded-full bg-brand text-[10px] font-medium text-white">
          {count}
        </span>
      )}
    </button>
  );
}

export { CartButton };
