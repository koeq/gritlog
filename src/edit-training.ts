import { Training } from "./../db-handler/types";

export const editTraining = async (currentTraining: Training) => {
  try {
    const url = import.meta.env.VITE_TRAINING_URL;

    const requestOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_GATEWAY_API_KEY,
      },
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(currentTraining),
    };

    await fetch(url, requestOptions);
  } catch (err) {
    console.log(err);
  }
};
