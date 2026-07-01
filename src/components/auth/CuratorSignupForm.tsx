"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { curatorSignupSchema, type CuratorSignupInput } from "@/lib/validations/auth";
import { slugify } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { FileUpload } from "@/components/ui/FileUpload";
import { toast } from "@/components/ui/Toast";
import { notifyCuratorSignup } from "@/lib/actions/signup-notify";

async function findAvailableSlug(supabase: ReturnType<typeof createClient>, base: string) {
  let candidate = base || "curator";
  let suffix = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data } = await supabase
      .from("curator_stores")
      .select("id")
      .eq("store_slug", candidate)
      .maybeSingle();
    if (!data) return candidate;
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
}

export function CuratorSignupForm() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CuratorSignupInput>({
    resolver: zodResolver(curatorSignupSchema),
    defaultValues: { brandColor: "#63001F" },
  });

  const brandName = watch("brandName") || "Your Brand";
  const brandColor = watch("brandColor") || "#63001F";
  const photoPreviewUrl = photoFile ? URL.createObjectURL(photoFile) : null;

  const onSubmit = async (values: CuratorSignupInput) => {
    setIsSubmitting(true);
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (signUpError) {
        toast.error(signUpError.message);
        return;
      }
      const user = signUpData.user;
      if (!user || !signUpData.session) {
        toast.error(
          "Sign up requires email confirmation on this project. Disable 'Confirm email' in Supabase Auth settings to allow instant access.",
        );
        return;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .insert({ id: user.id, role: "curator", full_name: values.fullName, email: values.email });
      if (profileError) throw profileError;

      let profilePhotoUrl: string | null = null;
      if (photoFile) {
        const ext = photoFile.name.split(".").pop() ?? "jpg";
        const path = `${user.id}/profile.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("curator-photos")
          .upload(path, photoFile, { upsert: true });
        if (uploadError) throw uploadError;
        profilePhotoUrl = supabase.storage.from("curator-photos").getPublicUrl(path).data.publicUrl;
      }

      const { data: curator, error: curatorError } = await supabase
        .from("curators")
        .insert({
          profile_id: user.id,
          brand_name: values.brandName,
          brand_color: values.brandColor,
          profile_photo_url: profilePhotoUrl,
          bank_name: values.bankName,
          account_number: values.accountNumber,
          account_name: values.accountName,
        })
        .select()
        .single();
      if (curatorError) throw curatorError;

      const slug = await findAvailableSlug(supabase, slugify(values.brandName));
      const { error: storeError } = await supabase.from("curator_stores").insert({
        curator_id: curator.id,
        store_slug: slug,
      });
      if (storeError) throw storeError;

      await notifyCuratorSignup(values.brandName);

      toast.success("Storefront created — welcome to CurateCo.");
      router.push("/curator/products");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-medium text-[#1A1A1A]">Become a Curator</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Build your storefront and start earning from your taste.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Full Name" placeholder="Debbie Okafor" {...register("fullName")} error={errors.fullName?.message} />
        <Input label="Email" type="email" placeholder="you@example.com" {...register("email")} error={errors.email?.message} />
        <Input label="Password" type="password" placeholder="At least 8 characters" {...register("password")} error={errors.password?.message} />
        <Input label="Brand Name" placeholder="e.g. Debbie" {...register("brandName")} error={errors.brandName?.message} />
      </div>

      <ColorPicker
        label="Brand Color"
        value={brandColor}
        onChange={(value) => setValue("brandColor", value, { shouldValidate: true })}
      />

      <div className="flex flex-col gap-2">
        <FileUpload
          label="Profile Photo"
          hint="This photo will appear as the hero background of your storefront. Use a high-quality, well-lit image."
          accept="image/*"
          onFilesChange={(files) => setPhotoFile(files[0] ?? null)}
        />
        {photoPreviewUrl && (
          <div
            className="relative mt-2 h-40 w-full overflow-hidden rounded-xl bg-cover bg-center"
            style={{ backgroundImage: `url(${photoPreviewUrl})` }}
          >
            <div className="absolute inset-0" style={{ backgroundColor: brandColor, opacity: 0.25 }} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/70" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="font-display text-xl italic text-white">Curated by {brandName}</p>
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="font-display text-lg font-medium text-[#1A1A1A]">Bank Details</h2>
        <p className="mb-3 text-xs text-text-muted">Used to pay out your commissions.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Bank Name" placeholder="GTBank" {...register("bankName")} error={errors.bankName?.message} />
          <Input label="Account Number" placeholder="0123456789" {...register("accountNumber")} error={errors.accountNumber?.message} />
          <Input label="Account Name" placeholder="Debbie Okafor" className="sm:col-span-2" {...register("accountName")} error={errors.accountName?.message} />
        </div>
      </div>

      <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
        Create My Storefront
      </Button>

      <p className="text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-brand hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
