import { Trainings } from "./types";
import { useEffect } from "react";

export const useSyncLocalStorage = (
  id: number,
  trainings: Trainings | undefined
) => {
  // read from local storage on mount
  useEffect(() => {

  }, []) 

  // save to local storage on change
  useEffect(() => {
    localStorage.setItem("id", `${id}`);

    if (trainings) {
      localStorage.setItem("trainings", JSON.stringify(trainings));
    }
  }, [id, trainings]);
};
