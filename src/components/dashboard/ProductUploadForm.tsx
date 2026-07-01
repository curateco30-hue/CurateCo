"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { productUploadSchema, type ProductUploadInput } from "@/lib/validations/product";
import { notifyProductSubmitted } from "@/lib/actions/brand-products";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { TagSelector } from "@/components/ui/TagSelector";
import { toast } from "@/components/ui/Toast";

const SIZE_PRESETS = ["XS", "S", "M", "L", "XL", "XXL"];
const COLOR_PRESETS = ["Black", "White", "Beige", "Olive", "Navy", "Brown"];

interface ProductUploadFormProps {
  brandId: string;
}

function ProductUploadForm({ brandId }: ProductUploadFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [images, setImages] = useState<File[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProductUploadInput>({ resolver: zodResolver(productUploadSchema) });

  const description = watch("description") || "";

  const onSubmit = async (values: ProductUploadInput) => {
    if (images.length === 0) {
      toast.error("Add at least one product image.");
      return;
    }
    if (sizes.length === 0) {
      toast.error("Select at least one size.");
      return;
    }
    if (colors.length === 0) {
      toast.error("Select at least one color.");
      return;
    }

    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Your session expired. Please log in again.");

      const imageUrls: string[] = [];
      for (const file of images) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, file);
        if (uploadError) throw uploadError;
        imageUrls.push(supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl);
      }

      const { error: insertError } = await supabase.from("products").insert({
        brand_id: brandId,
        name: values.name,
        description: values.description,
        base_price: Number(values.basePrice),
        stock: Number(values.stock),
        sizes,
        colors,
        images: imageUrls,
      });
      if (insertError) throw insertError;

      await notifyProductSubmitted(brandId, values.name);

      toast.success("Product submitted for approval.");
      router.push("/brand/products");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FileUpload
        label="Product Images"
        hint="Up to 3 images. First image is used as the cover."
        accept="image/*"
        multiple
        maxFiles={3}
        onFilesChange={setImages}
      />

      <Input label="Product Name" placeholder="T-Shirt Short" {...register("name")} error={errors.name?.message} />

      <Textarea
        label="Description"
        placeholder="Describe the fabric, fit, and details customers should know."
        maxLength={1000}
        value={description}
        {...register("description")}
        error={errors.description?.message}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Base Price (₦)"
          type="number"
          min={0}
          step="0.01"
          placeholder="65000"
          {...register("basePrice")}
          error={errors.basePrice?.message}
        />
        <Input
          label="Available Stock"
          type="number"
          min={0}
          placeholder="24"
          {...register("stock")}
          error={errors.stock?.message}
        />
      </div>

      <TagSelector label="Sizes" presets={SIZE_PRESETS} value={sizes} onChange={setSizes} />
      <TagSelector label="Colors" presets={COLOR_PRESETS} value={colors} onChange={setColors} />

      <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
        Submit for Approval
      </Button>
    </form>
  );
}

export { ProductUploadForm };
