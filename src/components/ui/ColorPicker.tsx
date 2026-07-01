"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function ColorPicker({ label, value, onChange, className }: ColorPickerProps) {
  const id = useId();
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[#1A1A1A]">
          {label}
        </label>
      )}
      <div className="flex items-center gap-3">
        <div className="relative size-11 shrink-0 overflow-hidden rounded-full border border-border shadow-sm">
          <input
            id={id}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -inset-2 size-[150%] cursor-pointer border-none p-0"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="w-32 rounded-xl border border-border bg-white px-3 py-2 text-sm uppercase text-[#1A1A1A] outline-none transition-all duration-300 ease-in-out focus:border-brand focus:ring-2 focus:ring-brand/15"
        />
      </div>
    </div>
  );
}

export { ColorPicker };
