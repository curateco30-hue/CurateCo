"use client";

import { useState } from "react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";

interface StoreEditFormProps {
  storeId: string;
  brandName: string;
  initialPrefix: string;
  initialIntroText: string;
}

function StoreEditForm({ storeId, brandName, initialPrefix, initialIntroText }: StoreEditFormProps) {
  const supabase = createClient();
  const [prefix, setPrefix] = useState(initialPrefix);
  const [introText, setIntroText] = useState(initialIntroText);
  const [isSaving, setIsSaving] = useState(false);

  const save = async () => {
    if (introText.length > 300) {
      toast.error("Introduction must be 300 characters or fewer.");
      return;
    }
    setIsSaving(true);
    const { error } = await supabase
      .from("curator_stores")
      .update({ intro_headline_prefix: prefix.trim() || "Curated by", intro_text: introText.trim() })
      .eq("id", storeId);
    setIsSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Storefront updated.");
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Input
          label="Storefront Headline Prefix"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          placeholder="Curated by"
        />
        <p className="mt-2 rounded-xl border border-border bg-beige p-4 font-display text-xl italic text-[#1A1A1A]">
          {prefix || "Curated by"} {brandName}
        </p>
      </div>

      <Textarea
        label="Introduction / Bio"
        value={introText}
        onChange={(e) => setIntroText(e.target.value)}
        maxLength={300}
        hint="Shown beneath your storefront hero."
      />

      <Button onClick={save} isLoading={isSaving} className="w-full sm:w-fit">
        Save Changes
      </Button>
    </div>
  );
}

export { StoreEditForm };
