import { z } from "zod";

const hexColor = /^#([0-9a-fA-F]{6})$/;
const nubanAccountNumber = /^\d{10}$/;

export const curatorSignupSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
  brandName: z.string().min(2, "Enter your brand name"),
  brandColor: z.string().regex(hexColor, "Pick a valid color"),
  bankName: z.string().min(2, "Enter your bank name"),
  accountNumber: z.string().regex(nubanAccountNumber, "Enter a 10-digit account number"),
  accountName: z.string().min(2, "Enter the account name"),
});

export type CuratorSignupInput = z.infer<typeof curatorSignupSchema>;

export const brandSignupSchema = z.object({
  businessName: z.string().min(2, "Enter your business name"),
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
  description: z.string().min(10, "Tell customers a bit more about the brand"),
  bankName: z.string().min(2, "Enter your bank name"),
  accountNumber: z.string().regex(nubanAccountNumber, "Enter a 10-digit account number"),
  accountName: z.string().min(2, "Enter the account name"),
});

export type BrandSignupInput = z.infer<typeof brandSignupSchema>;

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

export type LoginInput = z.infer<typeof loginSchema>;
