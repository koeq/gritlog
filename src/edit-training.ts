import { Training } from "./../db-handler/types";

export const editTraining = async (id: number, currentTraining: Training) => {
  try {
    const trainingUrl = import.meta.env.VITE_TRAINING_URL;
    const queryParams = new URLSearchParams(`id=${id}`);
    const url = `${trainingUrl}?${queryParams}`;

    const requestOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_GATEWAY_API_KEY,
      },
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(currentTraining),
    };

    const res = await fetch(url, requestOptions);
    console.log(await res.json());
  } catch (err) {
    console.log(err);
  }
};
