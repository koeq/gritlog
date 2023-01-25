import { z } from "zod";

export type Mode = z.infer<typeof mode>;
export type CurrentInput = z.infer<typeof currentInput>;

export const mode = z.discriminatedUnion("type", [
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

export const currentInput = z.string();
