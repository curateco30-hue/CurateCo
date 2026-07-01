"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { dashboardPathForRole } from "@/lib/auth/redirect-for-role";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import type { ProfileRole } from "@/types/database";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginInput) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword(values);
      if (error || !data.user) {
        toast.error(error?.message ?? "Invalid email or password");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError || !profile) {
        toast.error("We couldn't find an account profile for this login.");
        return;
      }

      toast.success("Welcome back.");
      const redirectTo = searchParams.get("redirectTo");
      router.push(redirectTo || dashboardPathForRole(profile.role as ProfileRole));
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-[#1A1A1A]">Welcome Back</h1>
        <p className="mt-1 text-sm text-text-secondary">Log in to your CurateCo account.</p>
      </div>

      <Input label="Email" type="email" placeholder="you@example.com" {...register("email")} error={errors.email?.message} />
      <Input label="Password" type="password" placeholder="Your password" {...register("password")} error={errors.password?.message} />

      <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
        Log In
      </Button>

      <div className="flex flex-col items-center gap-2 text-sm text-text-secondary">
        <p>
          New to CurateCo?{" "}
          <Link href="/auth/signup/curator" className="font-medium text-brand hover:underline">
            Become a Curator
          </Link>{" "}
          or{" "}
          <Link href="/auth/signup/brand" className="font-medium text-brand hover:underline">
            Register a Brand
          </Link>
        </p>
      </div>
    </form>
  );
}
