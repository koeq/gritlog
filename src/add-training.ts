import { Training } from "../db-handler/types";
import { SetAuthedContext } from "./app";
import { useSafeContext } from "./utils/use-safe-context";

export const addTraining = async (training: Training) => {
  const setAuthed = useSafeContext(SetAuthedContext, "SetAuthed");

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
      setAuthed(false);
    }
  } catch (err) {
    console.log(err);
  }
};
