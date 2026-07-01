"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagSelectorProps {
  label: string;
  presets?: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

function TagSelector({ label, presets = [], value, onChange, placeholder }: TagSelectorProps) {
  const [customInput, setCustomInput] = useState("");

  const toggle = (tag: string) => {
    onChange(value.includes(tag) ? value.filter((t) => t !== tag) : [...value, tag]);
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setCustomInput("");
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[#1A1A1A]">{label}</label>
      {presets.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              type="button"
              key={preset}
              onClick={() => toggle(preset)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-300 ease-in-out",
                value.includes(preset)
                  ? "border-brand bg-brand-pale text-brand"
                  : "border-border text-text-secondary hover:border-brand/50",
              )}
            >
              {preset}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
          placeholder={placeholder ?? "Add custom option and press Enter"}
          className="flex-1 rounded-xl border border-border bg-white px-4 py-2 text-sm outline-none transition-all duration-300 ease-in-out focus:border-brand focus:ring-2 focus:ring-brand/15"
        />
      </div>
      {value.filter((v) => !presets.includes(v)).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value
            .filter((v) => !presets.includes(v))
            .map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 rounded-full border border-brand bg-brand-pale px-3.5 py-1.5 text-sm font-medium text-brand"
              >
                {tag}
                <button type="button" onClick={() => toggle(tag)} aria-label={`Remove ${tag}`}>
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
        </div>
      )}
    </div>
  );
}

export { TagSelector };
