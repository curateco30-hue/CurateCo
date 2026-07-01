"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { brandSignupSchema, type BrandSignupInput } from "@/lib/validations/auth";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { toast } from "@/components/ui/Toast";
import { notifyBrandSignup } from "@/lib/actions/signup-notify";

export function BrandSignupForm() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BrandSignupInput>({
    resolver: zodResolver(brandSignupSchema),
  });

  const description = watch("description") || "";

  const onSubmit = async (values: BrandSignupInput) => {
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
        .insert({ id: user.id, role: "brand", full_name: values.businessName, email: values.email });
      if (profileError) throw profileError;

      let logoUrl: string | null = null;
      if (logoFile) {
        const ext = logoFile.name.split(".").pop() ?? "png";
        const path = `${user.id}/logo.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("brand-logos")
          .upload(path, logoFile, { upsert: true });
        if (uploadError) throw uploadError;
        logoUrl = supabase.storage.from("brand-logos").getPublicUrl(path).data.publicUrl;
      }

      const { error: brandError } = await supabase.from("brands").insert({
        profile_id: user.id,
        business_name: values.businessName,
        logo_url: logoUrl,
        description: values.description,
        bank_name: values.bankName,
        account_number: values.accountNumber,
        account_name: values.accountName,
      });
      if (brandError) throw brandError;

      await notifyBrandSignup(values.businessName);

      toast.success("Brand account created — welcome to CurateCo.");
      router.push("/brand/dashboard");
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
        <h1 className="font-display text-2xl font-medium text-[#1A1A1A]">Register Your Brand</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Get certified and let curators sell your pieces to their audience.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Business Name" placeholder="Atelier Noir" {...register("businessName")} error={errors.businessName?.message} />
        <Input label="Email" type="email" placeholder="you@example.com" {...register("email")} error={errors.email?.message} />
        <Input label="Password" type="password" placeholder="At least 8 characters" {...register("password")} error={errors.password?.message} />
      </div>

      <FileUpload
        label="Business Logo"
        hint="Square images work best."
        accept="image/*"
        onFilesChange={(files) => setLogoFile(files[0] ?? null)}
      />

      <Textarea
        label="Business Description"
        placeholder="Tell curators and customers what your brand is about."
        maxLength={500}
        value={description}
        {...register("description")}
        error={errors.description?.message}
      />

      <div>
        <h2 className="font-display text-lg font-medium text-[#1A1A1A]">Bank Details</h2>
        <p className="mb-3 text-xs text-text-muted">Used to pay out order proceeds.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Bank Name" placeholder="Zenith Bank" {...register("bankName")} error={errors.bankName?.message} />
          <Input label="Account Number" placeholder="0123456789" {...register("accountNumber")} error={errors.accountNumber?.message} />
          <Input label="Account Name" placeholder="Atelier Noir Ltd" className="sm:col-span-2" {...register("accountName")} error={errors.accountName?.message} />
        </div>
      </div>

      <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
        Create Brand Account
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
