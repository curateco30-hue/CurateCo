"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useCartStore, cartSubtotal } from "@/lib/store/cart";
import { formatNaira } from "@/lib/utils";

function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, storeSlug } = useCartStore();
  const subtotal = cartSubtotal(items);

  return (
    <Modal isOpen={isOpen} onClose={closeCart} title="Your Cart" variant="drawer">
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <ShoppingBag className="size-8 text-text-muted" />
          <p className="text-sm text-text-muted">Your cart is empty.</p>
          <Button variant="secondary" onClick={closeCart}>
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-beige">
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#1A1A1A]">{item.name}</p>
                  <p className="text-xs text-text-muted">
                    {item.size} / {item.color}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                      className="flex size-6 items-center justify-center rounded-full border border-border"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="w-4 text-center text-xs">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                      className="flex size-6 items-center justify-center rounded-full border border-border"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <p className="text-sm font-medium text-[#1A1A1A]">
                    {formatNaira(item.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeItem(item.productId, item.size, item.color)}
                    aria-label="Remove"
                    className="text-text-muted hover:text-red-600"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Subtotal</span>
              <span className="font-display text-lg font-medium text-[#1A1A1A]">
                {formatNaira(subtotal)}
              </span>
            </div>
            <Link href={storeSlug ? `/checkout/${storeSlug}` : "#"} onClick={closeCart}>
              <Button className="mt-4 w-full">Checkout</Button>
            </Link>
            <button
              onClick={closeCart}
              className="mt-3 w-full text-center text-sm text-text-secondary hover:text-[#1A1A1A]"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export { CartDrawer };
