import { getVolumeChanges } from "./get-volume-changes";
import { getVolumePerExercise } from "./get-volume-per-exercise";
import {
  Training,
  TrainingWithoutVolume,
  TrainingWithoutVolumeChanges,
} from "./types";

export const addExerciseVolumeMap = (
  training: TrainingWithoutVolume
): TrainingWithoutVolumeChanges => ({
  ...training,
  exerciseVolumeMap: getVolumePerExercise(training.exercises),
});

export const addVolumeChanges = (
  training: TrainingWithoutVolumeChanges,
  _: number,
  trainings: TrainingWithoutVolumeChanges[]
): Training => ({
  ...training,
  volumeChanges: getVolumeChanges(training, trainings),
});
