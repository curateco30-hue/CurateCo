"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  variant?: "center" | "drawer";
  className?: string;
}

function Modal({ isOpen, onClose, title, children, variant = "center", className }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof window === "undefined") return null;

  const isDrawer = variant === "drawer";

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-black/40 transition-opacity duration-300 ease-in-out"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative flex flex-col bg-white shadow-xl transition-all duration-300 ease-in-out",
          isDrawer
            ? "ml-auto h-full w-full max-w-md animate-[slide-in_0.3s_ease-in-out]"
            : "m-auto max-h-[90vh] w-full max-w-lg rounded-2xl",
          className,
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="font-display text-xl font-medium text-[#1A1A1A]">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1.5 text-text-secondary transition-colors duration-300 hover:bg-beige"
            >
              <X className="size-5" />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-text-secondary transition-colors duration-300 hover:bg-beige"
          >
            <X className="size-5" />
          </button>
        )}
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

export { Modal };
