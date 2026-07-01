import { z } from "zod";

export const productUploadSchema = z.object({
  name: z.string().min(2, "Enter a product name"),
  description: z.string().min(10, "Add a short description"),
  basePrice: z
    .string()
    .min(1, "Enter a price")
    .refine((v) => Number(v) > 0, "Enter a valid price"),
  stock: z
    .string()
    .min(1, "Enter available stock")
    .refine((v) => Number.isInteger(Number(v)) && Number(v) >= 0, "Enter a valid stock quantity"),
});

export type ProductUploadInput = z.infer<typeof productUploadSchema>;
