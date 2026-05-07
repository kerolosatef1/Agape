import { z } from "zod";

export const receiveSchema = z.object({
  recieveFrom: z.string().trim().min(1, "Received from is required").min(2, "Must be at least 2 characters"),
  description: z.string().trim().min(1, "Description is required").min(3, "Must be at least 3 characters"),
  moneyAmount: z.number({ invalid_type_error: "Amount is required" }).positive("Must be positive").min(1, "Must be at least 1"),
  classId: z.string().min(1, "Class is required"),
});

export type TReceiveInput = z.infer<typeof receiveSchema>;