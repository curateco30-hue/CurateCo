import type { Metadata } from "next";
import { CuratorSignupForm } from "@/components/auth/CuratorSignupForm";

export const metadata: Metadata = { title: "Become a Curator — CurateCo" };

export default function CuratorSignupPage() {
  return <CuratorSignupForm />;
}
