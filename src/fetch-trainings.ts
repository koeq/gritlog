import { TrainingSchema } from "./schemas";
import { Training } from "./types";

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

    const trainings: unknown = await res.json();

    return TrainingSchema.array().parse(trainings);
  } catch (error) {
    console.error(error);

    return [];
  }
};
