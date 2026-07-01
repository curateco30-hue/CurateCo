"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { toast } from "@/components/ui/Toast";
import { useCartStore, cartSubtotal } from "@/lib/store/cart";
import { createOrder } from "@/lib/actions/checkout";
import { saveCartSnapshot } from "@/lib/actions/cart";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations/checkout";
import { formatNaira } from "@/lib/utils";

interface CheckoutFormProps {
  storeSlug: string;
}

function CheckoutForm({ storeSlug }: CheckoutFormProps) {
  const router = useRouter();
  const { items, storeSlug: cartStoreSlug, clear } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutInput>({ resolver: zodResolver(checkoutSchema) });

  const validItems = cartStoreSlug === storeSlug ? items : [];
  const subtotal = cartSubtotal(validItems);

  const onSubmit = async (values: CheckoutInput) => {
    if (validItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    setIsSubmitting(true);
    try {
      const { orderRefs } = await createOrder({
        ...values,
        storeSlug,
        items: validItems.map((item) => ({
          productId: item.productId,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        })),
      });
      clear();
      router.push(`/order/success?ref=${orderRefs.join(",")}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (validItems.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-sm text-text-muted">Your cart is empty.</p>
        <Link href={`/store/${storeSlug}`} className="mt-4 inline-block">
          <Button variant="secondary">Back to Store</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-medium text-[#1A1A1A]">Delivery Details</h2>
        <Input label="Full Name" {...register("customerName")} error={errors.customerName?.message} />
        <Input
          label="Phone Number"
          type="tel"
          {...register("customerPhone")}
          error={errors.customerPhone?.message}
        />
        <Input
          label="Alternative Phone Number (optional)"
          type="tel"
          {...register("customerAltPhone")}
        />
        <Input
          label="Email (optional, for order updates)"
          type="email"
          {...register("customerEmail", {
            onBlur: (e) => {
              const email = e.target.value.trim();
              if (email && /\S+@\S+\.\S+/.test(email)) {
                saveCartSnapshot(
                  storeSlug,
                  email,
                  validItems.map((item) => ({
                    productId: item.productId,
                    name: item.name,
                    size: item.size,
                    color: item.color,
                    quantity: item.quantity,
                  })),
                );
              }
            },
          })}
          error={errors.customerEmail?.message}
        />
        <Textarea
          label="Delivery Address"
          {...register("deliveryAddress")}
          error={errors.deliveryAddress?.message}
        />
        <Button type="submit" size="lg" isLoading={isSubmitting} className="mt-2 w-full">
          Place Order
        </Button>
      </form>

      <Card className="h-fit p-6">
        <h2 className="mb-4 font-display text-xl font-medium text-[#1A1A1A]">Order Summary</h2>
        <div className="flex flex-col gap-4">
          {validItems.map((item) => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-beige">
                {item.image && (
                  <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1A1A1A]">{item.name}</p>
                <p className="text-xs text-text-muted">
                  {item.size} / {item.color} × {item.quantity}
                </p>
              </div>
              <p className="text-sm font-medium text-[#1A1A1A]">
                {formatNaira(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm text-text-secondary">Subtotal</span>
          <span className="font-display text-lg font-medium text-[#1A1A1A]">
            {formatNaira(subtotal)}
          </span>
        </div>
      </Card>
    </div>
  );
}

export { CheckoutForm };
