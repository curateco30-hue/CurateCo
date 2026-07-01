"use client";

import { Input, Textarea } from "@/components/ui/Input";

type JsonValue = string | number | boolean | JsonValue[] | { [key: string]: JsonValue };

interface JsonSettingsFormProps {
  value: Record<string, JsonValue>;
  onChange: (value: Record<string, JsonValue>) => void;
}

function humanize(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

function setAt(obj: Record<string, JsonValue>, key: string, value: JsonValue) {
  return { ...obj, [key]: value };
}

function FieldGroup({
  data,
  onChange,
}: {
  data: Record<string, JsonValue>;
  onChange: (value: Record<string, JsonValue>) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {Object.entries(data).map(([key, val]) => {
        const label = humanize(key);

        if (typeof val === "boolean") {
          return (
            <label key={key} className="flex items-center gap-2.5 text-sm font-medium text-[#1A1A1A]">
              <input
                type="checkbox"
                checked={val}
                onChange={(e) => onChange(setAt(data, key, e.target.checked))}
                className="size-4 accent-brand"
              />
              {label}
            </label>
          );
        }

        if (typeof val === "number") {
          return (
            <Input
              key={key}
              label={label}
              type="number"
              value={val}
              onChange={(e) => onChange(setAt(data, key, Number(e.target.value)))}
            />
          );
        }

        if (Array.isArray(val)) {
          return (
            <Input
              key={key}
              label={`${label} (comma separated)`}
              value={val.join(", ")}
              onChange={(e) =>
                onChange(
                  setAt(
                    data,
                    key,
                    e.target.value
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean),
                  ),
                )
              }
            />
          );
        }

        if (typeof val === "object" && val !== null) {
          return (
            <div key={key} className="rounded-xl border border-border p-4">
              <p className="mb-3 text-sm font-semibold text-[#1A1A1A]">{label}</p>
              <FieldGroup
                data={val as Record<string, JsonValue>}
                onChange={(nested) => onChange(setAt(data, key, nested))}
              />
            </div>
          );
        }

        const str = String(val ?? "");
        const isLong = str.length > 60 || /text|message|note|description/i.test(key);
        return isLong ? (
          <Textarea
            key={key}
            label={label}
            value={str}
            onChange={(e) => onChange(setAt(data, key, e.target.value))}
          />
        ) : (
          <Input
            key={key}
            label={label}
            value={str}
            onChange={(e) => onChange(setAt(data, key, e.target.value))}
          />
        );
      })}
    </div>
  );
}

function JsonSettingsForm({ value, onChange }: JsonSettingsFormProps) {
  return <FieldGroup data={value} onChange={onChange} />;
}

export { JsonSettingsForm };
export type { JsonValue };
