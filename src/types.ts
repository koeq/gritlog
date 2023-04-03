import { z } from "zod";
import { TrainingSchema } from "./schemas";

export type Training = z.infer<typeof TrainingSchema>;
export type Exercise = Training["exercises"][number];
export type CurrentInput = string;

export type AddMode = {
  type: "add";
};

export type EditMode = {
  id: number;
  type: "edit";
  initialInput: string;
  date: string;
};

export type DeleteMode = {
  id: number;
  type: "delete";
};

export type Mode = AddMode | EditMode | DeleteMode;
