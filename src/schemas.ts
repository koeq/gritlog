import { z } from "zod";

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
