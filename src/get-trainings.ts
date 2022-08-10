import { Trainings } from "../db-handler/types";

export const getTrainings = async (
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
  const trainings = (await res.json()) as Trainings | [];

  if (trainings.length > 0) {
    setTrainings(trainings);
  }
};
