import Link from "next/link";
import { LayoutTemplate, Grid3x3, FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Templates — CurateCo Admin" };

const templates = [
  {
    href: "/admin/templates/storefront",
    icon: LayoutTemplate,
    title: "Storefront",
    description: "Hero, intro, product collection, and footer for every curator storefront.",
  },
  {
    href: "/admin/templates/product-listing",
    icon: Grid3x3,
    title: "Product Listing",
    description: "The platform product feed curators browse to build their store.",
  },
  {
    href: "/admin/templates/product-detail",
    icon: FileText,
    title: "Product Detail",
    description: "Individual product pages, including the Why I Curated This block.",
  },
];

export default function AdminTemplatesIndexPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-[#1A1A1A]">Templates</h1>
        <p className="text-sm text-text-secondary">
          Edit the content and layout of the three core page templates. Changes apply globally.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {templates.map((template) => (
          <Link key={template.href} href={template.href}>
            <Card className="flex h-full flex-col p-6 hover:border-brand/40">
              <div className="flex size-11 items-center justify-center rounded-full bg-brand-pale">
                <template.icon className="size-5 text-brand" />
              </div>
              <p className="mt-4 font-display text-lg font-medium text-[#1A1A1A]">
                {template.title}
              </p>
              <p className="mt-1 text-sm text-text-secondary">{template.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
