import { Trainings } from "./types";

export const getAllTrainings = async (
  setTrainings: React.Dispatch<React.SetStateAction<Trainings | undefined>>
) => {
  const trainingUrl = import.meta.env.VITE_TRAINING_URL;

  const requestOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_GATEWAY_API_KEY,
    },
    method: "GET",
    credentials: "include",
  };

  const res = await fetch(trainingUrl, requestOptions);
  const trainings = (await res.json()) as Trainings | undefined;

  if (trainings) {
    setTrainings(trainings)
  }
};
