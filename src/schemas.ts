import { z } from "zod";

// Null types can also be undefined because of changed implementation in the past
export const TrainingSchema = z.object({
  date: z.string(),
  id: z.number(),
  headline: z.union([z.string(), z.null()]),
  exercises: z
    .object({
      exerciseName: z.union([z.string(), z.null(), z.undefined()]),
      weight: z.union([z.string(), z.null(), z.undefined()]),
      repetitions: z.union([z.string(), z.null(), z.undefined()]),
    })
    .array(),
});
