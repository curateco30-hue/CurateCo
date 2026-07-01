import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef, useId } from "react";
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
  ({ className, label, error, hint, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#1A1A1A]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            fieldClasses,
            error && "border-red-400 focus:border-red-400 focus:ring-red-100",
            className,
          )}
          {...props}
        />
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
