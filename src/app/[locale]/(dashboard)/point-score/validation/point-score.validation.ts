import { z } from "zod";

export const pointScoreSchema = z.object({
  name: z.string().trim().min(1, "Required").min(2, "Min 2 chars"),

  topicScore: z.number({
    error: "Required",
  }).min(0, "Min 0"),

  preparationScore: z.number({
    error: "Required",
  }).min(0, "Min 0"),

  visitScore: z.number({
    error: "Required",
  }).min(0, "Min 0"),

  attendClassScore: z.number({
    error: "Required",
  }).min(0, "Min 0"),

  attendVolunteersMeetingScore: z.number({
    error: "Required",
  }).min(0, "Min 0"),

  festivalwinScore: z.number({
    error: "Required",
  }).min(0, "Min 0"),

  functionScore: z.number({
    error: "Required",
  }).min(0, "Min 0"),

  festivalwinIsLeadScore: z.number({
    error: "Required",
  }).min(0, "Min 0"),
});

export type TPointScoreInput = z.infer<typeof pointScoreSchema>;