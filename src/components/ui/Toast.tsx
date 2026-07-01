"use client";

import { create } from "zustand";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastStore {
  toasts: ToastItem[];
  push: (message: string, variant?: ToastVariant) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (message, variant = "success") =>
    set((state) => {
      const id = crypto.randomUUID();
      setTimeout(() => {
        useToastStore.getState().dismiss(id);
      }, 4000);
      return { toasts: [...state.toasts, { id, message, variant }] };
    }),
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (message: string) => useToastStore.getState().push(message, "success"),
  error: (message: string) => useToastStore.getState().push(message, "error"),
  info: (message: string) => useToastStore.getState().push(message, "info"),
};

const variantStyles: Record<ToastVariant, { icon: typeof CheckCircle2; classes: string }> = {
  success: { icon: CheckCircle2, classes: "border-emerald-200 bg-emerald-50 text-emerald-800" },
  error: { icon: XCircle, classes: "border-red-200 bg-red-50 text-red-800" },
  info: { icon: Info, classes: "border-border bg-white text-[#1A1A1A]" },
};

function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5">
      {toasts.map((t) => {
        const { icon: Icon, classes } = variantStyles[t.variant];
        return (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm",
              "min-w-[280px] max-w-sm transition-all duration-300 ease-in-out animate-[slide-up_0.3s_ease-in-out]",
              classes,
            )}
          >
            <Icon className="size-5 shrink-0" />
            <p className="flex-1 text-sm font-medium">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
              className="shrink-0 opacity-60 transition-opacity duration-300 hover:opacity-100"
            >
              <X className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export { Toaster };
