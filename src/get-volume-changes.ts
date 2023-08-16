import { getVolumePerExercise } from "./get-volume-per-exercise";
import { Training } from "./types";

export const getVolumeChanges = (
  training: Training,
  trainings: Training[]
): Record<string, number> | null => {
  const volumeChanges: Record<string, number> = {
    trainingId: training.id,
  };

  if (trainings.length < 2) {
    return null;
  }

  const exerciseVolumeMap = getVolumePerExercise(training);

  for (const [exerciseName, volume] of Object.entries(exerciseVolumeMap)) {
    if (volume === 0) {
      continue;
    }

    const trainingIndex = trainings.findIndex((t) => t.id === training.id);

    for (let i = trainingIndex + 1; i < trainings.length; i++) {
      const prevTraining = trainings[i];

      if (prevTraining === undefined) {
        continue;
      }

      const prevExerciseVolumeMap = getVolumePerExercise(prevTraining);
      const prevVolume = prevExerciseVolumeMap[exerciseName];

      if (!prevVolume) {
        continue;
      }

      const percentageChange = (volume / prevVolume - 1) * 100;
      volumeChanges[exerciseName] = percentageChange;
      break;
    }
  }

  return volumeChanges;
};
