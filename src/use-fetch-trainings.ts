import { useEffect } from "react";
import { fetchTrainings } from "./fetch-trainings";
import { Action } from "./state-reducer";

export const useFetchTrainings = (dispatch: React.Dispatch<Action>): void => {
  useEffect(() => {
    (async () => {
      const fetchedTrainings = await fetchTrainings();

      dispatch({
        type: "set-trainings",
        trainings: fetchedTrainings,
      });
    })();
  }, [dispatch]);
};
