import { z } from "zod";

export const stockSchema = z.object({
  itemName: z.string().trim().min(1, "Required").min(2, "Min 2 chars"),
  availableAmount: z.number({ invalid_type_error: "Required" }).min(0, "Min 0"),
  price: z.number({ invalid_type_error: "Required" }).positive("Must be positive"),
});

export type TStockInput = z.infer<typeof stockSchema>;