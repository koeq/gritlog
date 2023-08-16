import { z } from "zod";
import { TrainingSchema } from "./schemas";

// This is the type of the training as it comes from the DB.
export type TrainingAsOfSchema = z.infer<typeof TrainingSchema>;

export interface Training extends TrainingAsOfSchema {
  exerciseVolumeMap: Record<string, number>;
}

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
