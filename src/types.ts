import { z } from "zod";
import { CurrentInputSchema, ModeSchema, TrainingSchema } from "./schemas";

export type Training = z.infer<typeof TrainingSchema>;
export type Mode = z.infer<typeof ModeSchema>;
export type CurrentInput = z.infer<typeof CurrentInputSchema>;
