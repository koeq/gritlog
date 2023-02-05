import { z } from "zod";

export const TrainingSchema = z.object({
  date: z.string(),
  id: z.number(),
  headline: z.union([z.string(), z.null()]),
  exercises: z
    .object({
      exerciseName: z.union([z.string(), z.null()]),
      weight: z.union([z.string(), z.null()]),
      repetitions: z.union([z.string(), z.null()]),
    })
    .array(),
});

export const ModeSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("add"),
    id: z.number(),
  }),

  z.object({
    type: z.literal("edit"),
    id: z.number(),
    initialInput: z.string(),
  }),

  z.object({
    type: z.literal("delete"),
    id: z.number(),
  }),
]);

export const CurrentInputSchema = z.string();
