"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { updateMaxStoreProducts } from "@/lib/actions/admin-settings";

interface PlatformSettingsFormProps {
  initialMaxStoreProducts: number;
}

function PlatformSettingsForm({ initialMaxStoreProducts }: PlatformSettingsFormProps) {
  const [value, setValue] = useState(String(initialMaxStoreProducts));
  const [isSaving, setIsSaving] = useState(false);

  const save = async () => {
    const parsed = Number(value);
    setIsSaving(true);
    try {
      await updateMaxStoreProducts(parsed);
      toast.success("Platform settings updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Max products per curator store"
        type="number"
        min={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        hint="Also controls how many featured videos a curator can add — the two limits are always equal."
      />
      <Button onClick={save} isLoading={isSaving} className="w-fit">
        Save
      </Button>
    </div>
  );
}

export { PlatformSettingsForm };
