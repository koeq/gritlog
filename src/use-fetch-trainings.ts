import { useEffect, useState } from "react";
import { fetchTrainings } from "./fetch-trainings";
import { Action } from "./state-reducer";

export const useFetchTrainings = (
  dispatch: React.Dispatch<Action>
): boolean => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      dispatch({
        type: "set-trainings",
        trainings: await fetchTrainings(),
      });

      setIsLoading(false);
    })();
  }, [dispatch]);

  return isLoading;
};
