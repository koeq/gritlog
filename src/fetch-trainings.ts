import { addExerciseVolumeMap, addVolumeChanges } from "./enrich-trainings";
import { TrainingSchema } from "./schemas";
import { Training } from "./types";
import { sortTrainingsByDate } from "./utils/sort-trainings-by-date";

export const fetchTrainings = async (): Promise<Training[] | []> => {
  const trainingUrl = import.meta.env.VITE_TRAINING_URL;

  const requestOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_GATEWAY_API_KEY,
    },
    method: "GET",
    credentials: "include",
  };

  try {
    const res = await fetch(trainingUrl, requestOptions);

    if (res.status !== 200) {
      throw new Error(
        `Couldn't fetch trainings: Attempt responded with ${res.status} ${res.statusText}`
      );
    }

    const trainings = await res.json();

    return sortTrainingsByDate(TrainingSchema.array().parse(trainings))
      .map(addExerciseVolumeMap)
      .map(addVolumeChanges);
  } catch (error) {
    console.error(error);

    return [];
  }
};
