import { z } from "zod";

export const spendSchema = z.object({
  sendTo: z.string().trim().min(1, "Required").min(2, "Min 2 characters"),
  description: z.string().trim().min(1, "Required").min(3, "Min 3 characters"),
  moneyAmount: z.number({ invalid_type_error: "Required" }).positive("Must be positive"),
  classId: z.string().min(1, "Class is required"),
});

export type TSpendInput = z.infer<typeof spendSchema>;