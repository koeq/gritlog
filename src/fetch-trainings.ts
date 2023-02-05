import { Training } from "../lambdas/db-handler/types";

export const fetchTrainings = async (
  setTrainings: React.Dispatch<React.SetStateAction<Training[] | undefined>>
): Promise<void> => {
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
      console.error(
        `Couldn't fetch trainings: Attempt responded with ${res.status} ${res.statusText}`
      );
    }

    const trainings = (await res.json()) as Training[] | [];
    setTrainings(trainings);
  } catch (error) {
    console.log(error);
  }
};
