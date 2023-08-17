import { TrainingWithoutVolume } from "./types";

export const editTraining = async (
  currentTraining: TrainingWithoutVolume,
  logout: () => void
): Promise<void> => {
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

    const res = await fetch(url, requestOptions);

    if (res.status === 401) {
      logout();
    }
  } catch (err) {
    console.log(err);
  }
};
