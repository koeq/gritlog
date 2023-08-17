import { TrainingWithoutVolumeChanges } from "./types";

export const getVolumeChanges = (
  training: TrainingWithoutVolumeChanges,
  trainings: TrainingWithoutVolumeChanges[] | undefined
): Record<string, number> | null => {
  const volumeChanges: Record<string, number> = {};

  if (!trainings || trainings.length < 2) {
    return null;
  }

  for (const [exerciseName, volume] of Object.entries(
    training.exerciseVolumeMap
  )) {
    if (volume === 0) {
      continue;
    }

    const trainingIndex = trainings.findIndex((t) => t.id === training.id);

    // Start looking for exercises one training before.
    for (let i = trainingIndex + 1; i < trainings.length; i++) {
      const prevTraining = trainings[i];

      if (prevTraining === undefined) {
        continue;
      }

      const prevVolume = prevTraining.exerciseVolumeMap[exerciseName];

      if (!prevVolume) {
        continue;
      }

      const volumeChangeInPercent = (volume / prevVolume - 1) * 100;
      volumeChanges[exerciseName] = volumeChangeInPercent;
      break;
    }
  }

  return volumeChanges;
};
