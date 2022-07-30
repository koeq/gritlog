import { Trainings } from "./types";

export const getAllTrainings = async (
  setTrainings: React.Dispatch<React.SetStateAction<Trainings | undefined>>,
  setNextTrainingId: React.Dispatch<React.SetStateAction<number>>
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
    setTrainings(trainings);
    const currentId = trainings[trainings.length - 1].id;
    setNextTrainingId(currentId ? currentId + 1 : 0);
  }
};
