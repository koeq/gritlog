import { z } from "zod";

export const TrainingSchema = z.object({
  date: z.string(),
  endDate: z.union([z.string(), z.undefined()]),
  id: z.number(),
  headline: z.union([z.string(), z.null()]),
  exercises: z
    .object({
      // Null types can also be undefined because of changed implementation in the past
      exerciseName: z.union([z.string(), z.null(), z.undefined()]),
      weight: z.union([z.string(), z.null(), z.undefined()]),
      repetitions: z.union([z.string(), z.null(), z.undefined()]),
    })
    .array(),
});
