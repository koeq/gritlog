import { TrainingWithoutVolume } from "./types";

export const addTraining = async (
  training: TrainingWithoutVolume,
  logout: () => void
): Promise<void> => {
  try {
    const trainingUrl = import.meta.env.VITE_TRAINING_URL;

    const requestOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_GATEWAY_API_KEY,
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify(training),
    };

    const res = await fetch(trainingUrl, requestOptions);

    if (res.status === 401) {
      logout();
    }
  } catch (err) {
    console.log(err);
  }
};
