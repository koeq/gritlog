import { getVolumePerExercise } from "./get-volume-per-exercise";
import { Training, TrainingAsOfSchema } from "./types";

export const addExerciseVolumeMap = (
  trainings: TrainingAsOfSchema[]
): Training[] =>
  trainings.map<Training>((training) => ({
    ...training,
    exerciseVolumeMap: getVolumePerExercise(training.exercises),
  }));
