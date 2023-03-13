import { z } from "zod";
import { TrainingSchema } from "./schemas";

export type Training = z.infer<typeof TrainingSchema>;
export type Exercise = Training["exercises"][number];
export type CurrentInput = string;

export type Mode =
  | {
      id: number;
      type: "add";
    }
  | {
      id: number;
      type: "edit";
      initialInput: string;
    }
  | {
      id: number;
      type: "delete";
    };
