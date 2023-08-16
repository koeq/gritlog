import { getVolumePerExercise } from "./get-volume-per-exercise";
import { Training } from "./types";

interface TrainingWithVolume extends Training {
  exerciseVolumeMap: Record<string, number>;
}

export const addExerciseVolumeMap = (
  trainings: Training[]
): TrainingWithVolume[] =>
  trainings.map<TrainingWithVolume>((training) => ({
    ...training,
    exerciseVolumeMap: getVolumePerExercise(training),
  }));
