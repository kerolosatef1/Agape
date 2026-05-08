import { z } from "zod";

export const childSchema = z.object({
  chiledName: z.string().trim().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  gender: z.boolean(),
  description: z.string().optional(),
  typeNeedy: z.boolean(),
  classId: z.string().min(1, "Class is required"),
});

export type TChildInput = z.infer<typeof childSchema>;