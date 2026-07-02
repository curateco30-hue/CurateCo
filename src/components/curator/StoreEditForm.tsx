"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { ImageCropModal } from "@/components/ui/ImageCropModal";
import { toast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";

interface StoreEditFormProps {
  storeId: string;
  brandName: string;
  brandColor: string;
  initialPrefix: string;
  initialIntroText: string;
  initialPhotoUrl: string | null;
}

function StoreEditForm({
  storeId,
  brandName,
  brandColor,
  initialPrefix,
  initialIntroText,
  initialPhotoUrl,
}: StoreEditFormProps) {
  const supabase = createClient();
  const [prefix, setPrefix] = useState(initialPrefix);
  const [introText, setIntroText] = useState(initialIntroText);
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);
  const [cropSource, setCropSource] = useState<{ url: string; name: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

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

  const handleCroppedPhoto = async (file: File) => {
    setCropSource(null);
    setIsUploadingPhoto(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Session expired. Please log in again.");

      const path = `${user.id}/profile.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("curator-photos")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const newUrl = supabase.storage.from("curator-photos").getPublicUrl(path).data.publicUrl;
      // Bust the CDN/browser cache since the path is stable but content changed.
      const cacheBustedUrl = `${newUrl}?v=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("curators")
        .update({ profile_photo_url: cacheBustedUrl })
        .eq("profile_id", user.id);
      if (updateError) throw updateError;

      setPhotoUrl(cacheBustedUrl);
      toast.success("Storefront photo updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update photo.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label className="text-sm font-medium text-[#1A1A1A]">Storefront Hero Photo</label>
        <div
          className="relative mt-2 h-40 w-full overflow-hidden rounded-xl bg-cover bg-center"
          style={{ backgroundColor: brandColor }}
        >
          {photoUrl && (
            <Image src={photoUrl} alt="" fill sizes="600px" className="object-cover" unoptimized />
          )}
          <div className="absolute inset-0" style={{ backgroundColor: brandColor, opacity: 0.25 }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/70" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="font-display text-xl italic text-white">
              {prefix || "Curated by"} {brandName}
            </p>
          </div>
        </div>
        <FileUpload
          label=""
          hint="Upload a new photo to replace your storefront hero background."
          accept="image/*"
          onFilesChange={(files) => {
            const file = files[0];
            if (file) setCropSource({ url: URL.createObjectURL(file), name: file.name });
          }}
          className="mt-3"
        />
        {isUploadingPhoto && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
            <Camera className="size-3.5 animate-pulse" />
            Uploading photo…
          </p>
        )}
      </div>

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

      <ImageCropModal
        isOpen={!!cropSource}
        imageSrc={cropSource?.url ?? null}
        fileName={cropSource?.name ?? "profile.jpg"}
        aspect={16 / 9}
        onCancel={() => setCropSource(null)}
        onConfirm={handleCroppedPhoto}
      />
    </div>
  );
}

export { StoreEditForm };
