import { z } from "zod";
import { TrainingSchema } from "./schemas";

export type Training = z.infer<typeof TrainingSchema>;
export type Exercise = Training["exercises"][number];
export type CurrentInput = string;

export type AddMode = {
  id: number;
  type: "add";
};

export type EditMode = {
  id: number;
  type: "edit";
  initialInput: string;
};

export type DeleteMode = {
  id: number;
  type: "delete";
};

export type Mode = AddMode | EditMode | DeleteMode;
