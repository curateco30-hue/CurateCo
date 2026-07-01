import type { Metadata } from "next";
import { BrandSignupForm } from "@/components/auth/BrandSignupForm";

export const metadata: Metadata = { title: "Register Your Brand — CurateCo" };

export default function BrandSignupPage() {
  return <BrandSignupForm />;
}
