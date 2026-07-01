"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const fieldClasses =
  "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-[#1A1A1A] " +
  "placeholder:text-text-muted outline-none transition-all duration-300 ease-in-out " +
  "focus:border-brand focus:ring-2 focus:ring-brand/15 disabled:bg-beige disabled:cursor-not-allowed";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, type, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#1A1A1A]">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            className={cn(
              fieldClasses,
              isPassword && "pr-11",
              error && "border-red-400 focus:border-red-400 focus:ring-red-100",
              className,
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted transition-colors duration-300 hover:text-[#1A1A1A]"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          )}
        </div>
        {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  maxLength?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, maxLength, value, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const length = typeof value === "string" ? value.length : 0;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#1A1A1A]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          maxLength={maxLength}
          value={value}
          className={cn(fieldClasses, "min-h-28 resize-y", error && "border-red-400", className)}
          {...props}
        />
        <div className="flex items-center justify-between">
          {hint && !error ? (
            <p className="text-xs text-text-muted">{hint}</p>
          ) : (
            <span />
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
          {maxLength && (
            <p className="text-xs text-text-muted">
              {length}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Input, Textarea };
