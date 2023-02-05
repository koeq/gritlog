import { z } from "zod";
import { CurrentInputSchema, ModeSchema } from "./schemas";

export type Mode = z.infer<typeof ModeSchema>;
export type CurrentInput = z.infer<typeof CurrentInputSchema>;
