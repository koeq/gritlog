import { z } from "zod";
import { TrainingSchema } from "./schemas";

// This is the type of the training as it comes from the DB.
export type TrainingWithoutVolume = z.infer<typeof TrainingSchema>;
export type TrainingWithoutVolumeChanges = Omit<Training, "volumeChanges">;

export interface Training extends TrainingWithoutVolume {
  exerciseVolumeMap: Record<string, number>;
  volumeChanges: Record<string, number> | null;
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
