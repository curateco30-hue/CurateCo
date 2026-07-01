import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Enter your full name"),
  customerPhone: z.string().min(7, "Enter a valid phone number"),
  customerAltPhone: z.string().optional(),
  customerEmail: z.union([z.email("Enter a valid email"), z.literal("")]).optional(),
  deliveryAddress: z.string().min(10, "Enter your full delivery address"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
