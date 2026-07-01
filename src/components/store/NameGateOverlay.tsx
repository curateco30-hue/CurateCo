"use client";

import { useState, type ReactNode } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useCustomerNameStore } from "@/lib/store/customerName";

interface NameGateOverlayProps {
  storeSlug: string;
  curatorName: string;
  curatorPhotoUrl: string | null;
  brandColor: string;
  children: ReactNode;
}

function NameGateOverlay({ storeSlug, curatorName, curatorPhotoUrl, brandColor, children }: NameGateOverlayProps) {
  const hasHydrated = useCustomerNameStore((s) => s.hasHydrated);
  const savedName = useCustomerNameStore((s) => s.names[storeSlug]);
  const setName = useCustomerNameStore((s) => s.setName);
  const [firstName, setFirstName] = useState("");

  // Avoid a flash of the gate before persisted state has loaded.
  if (!hasHydrated) return null;

  if (savedName) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = firstName.trim();
    if (!trimmed) return;
    setName(storeSlug, trimmed);
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center"
      style={{ backgroundColor: `${brandColor}0D` }}
    >
      <Avatar name={curatorName} src={curatorPhotoUrl} size="xl" />
      <p className="mt-6 max-w-xs font-display text-2xl font-bold text-[#1A1A1A]">
        Hello! Can I know your name please?
      </p>
      <form onSubmit={handleSubmit} className="mt-6 flex w-full max-w-xs flex-col gap-3">
        <Input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Your first name"
          autoFocus
        />
        <Button type="submit" size="lg" className="w-full">
          Continue to {curatorName}&apos;s Store
        </Button>
      </form>
    </div>
  );
}

export { NameGateOverlay };
