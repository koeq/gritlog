import { z } from "zod";

export const TrainingSchema = z.object({
  date: z.string(),
  id: z.number(),
  // null types can also be undefined because of changed implementation in the past
  headline: z.union([z.string(), z.null(), z.undefined()]),
  exercises: z
    .object({
      exerciseName: z.union([z.string(), z.null(), z.undefined()]),
      weight: z.union([z.string(), z.null(), z.undefined()]),
      repetitions: z.union([z.string(), z.null(), z.undefined()]),
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
