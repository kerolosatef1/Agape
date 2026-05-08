import { z } from "zod";

export const stockSchema = z.object({
  itemName: z
    .string()
    .trim()
    .min(1, "Required")
    .min(2, "Min 2 chars"),

  availableAmount: z
    .number()
    .min(0, "Min 0"),

  price: z
    .number()
    .positive("Must be positive"),
});