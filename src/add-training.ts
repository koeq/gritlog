import { Training } from "../db-handler/types";

export const addTraining = async (training: Training) => {
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

    await fetch(trainingUrl, requestOptions);
  } catch (err) {
    console.log(err);
  }
};
