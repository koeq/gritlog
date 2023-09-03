import { z } from "zod";
import { TrainingSchema } from "./schemas";

// ------- What is the Training type we would really like to have? ---------
// }
//   id: number;
//   date: string;
//   headline: string | null;
//   exercises: {
//     name: string;
//     weight: {
//       value: number;
//       unit: 'kg' | 'lbs'; ---> string if not possible in DB schema.
//     };
//     repetitions: number[];
//   }[];
// }

// This is the type of the training as it comes from the DB.
export type TrainingWithoutVolume = z.infer<typeof TrainingSchema>;
export type TrainingWithoutVolumeChanges = Omit<Training, "volumeChanges">;

export interface Training extends TrainingWithoutVolume {
  exerciseVolumeMap: Record<string, number>;
  volumeChanges: Record<string, number> | null;
}

export type Exercise = Training["exercises"][number];

export interface CurrentInput {
  readonly headline: string;
  readonly exercises: string;
}

export type AddMode = {
  type: "add";
};

export type EditMode = {
  id: number;
  type: "edit";
  initialInput: CurrentInput;
  date: string;
};

export type DeleteMode = {
  id: number;
  type: "delete";
};

export type Mode = AddMode | EditMode | DeleteMode;
