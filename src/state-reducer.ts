import { addVolumeChanges as updateVolumeChanges } from "./enrich-trainings";
import { getVolumeChanges } from "./get-volume-changes";
import { getVolumePerExercise } from "./get-volume-per-exercise";
import {
  CurrentInput,
  EditMode,
  Mode,
  Training,
  TrainingWithoutVolume,
  TrainingWithoutVolumeChanges,
} from "./types";
import { sortTrainingsByDate } from "./utils/sort-trainings-by-date";

export type TopLevelState = {
  trainings: Training[];
  currentInput: CurrentInput;
  showBottomBar: boolean;
  mode: Mode;
  searchTerm: string;
};

export type Action =
  | { type: "add"; currentTraining: TrainingWithoutVolume }
  | { type: "edit"; mode: EditMode; currentTraining: TrainingWithoutVolume }
  | { type: "repeat"; currentInput: CurrentInput }
  | { type: "delete"; id: number }
  | { type: "set-trainings"; trainings: Training[] }
  | { type: "cancel-add" }
  | { type: "cancel-edit" }
  | {
      type: "set-edit-mode";
      id: number;
      serializedExercises: string;
      date: string;
    }
  | { type: "set-delete-mode"; id: number }
  | { type: "set-mode"; mode: Mode }
  | { type: "set-input"; currentInput: CurrentInput }
  | { type: "open-input" }
  | { type: "set-search-term"; searchTerm: string }
  | { type: "clear-search-term" };

const createTrainingWithVolume = (
  currentTraining: TrainingWithoutVolume,
  trainings: Training[]
): Training => {
  const temp: TrainingWithoutVolumeChanges = {
    ...currentTraining,
    exerciseVolumeMap: getVolumePerExercise(currentTraining.exercises),
  };

  return {
    ...temp,
    volumeChanges: getVolumeChanges(temp, trainings),
  };
};

export function reducer(state: TopLevelState, action: Action): TopLevelState {
  const { trainings } = state;

  switch (action.type) {
    case "add": {
      const { currentTraining } = action;

      return {
        ...state,
        showBottomBar: false,
        mode: { type: "add" },
        currentInput: { headline: "", exercises: "" },

        trainings: sortTrainingsByDate([
          ...trainings,
          createTrainingWithVolume(currentTraining, trainings),
        ]),
      };
    }

    case "edit": {
      const { currentTraining } = action;

      return {
        ...state,
        showBottomBar: false,
        mode: { type: "add" },
        currentInput: { headline: "", exercises: "" },

        trainings: trainings
          ?.map((training) =>
            training.id === currentTraining.id
              ? createTrainingWithVolume(currentTraining, trainings)
              : training
          )
          .map(updateVolumeChanges),
      };
    }

    case "repeat": {
      const { currentInput } = action;

      return {
        ...state,
        currentInput,
        showBottomBar: true,
        mode: { type: "add" },
      };
    }

    case "delete": {
      const { id } = action;

      return {
        ...state,
        trainings: trainings
          ?.filter(({ id: pastId }) => pastId !== id)
          .map(updateVolumeChanges),

        mode: {
          type: "add",
        },
      };
    }

    case "set-trainings": {
      const { trainings } = action;

      return {
        ...state,
        trainings: sortTrainingsByDate(trainings),
      };
    }

    case "cancel-add": {
      return {
        ...state,
        showBottomBar: false,
        currentInput: { headline: "", exercises: "" },
      };
    }

    case "cancel-edit": {
      return {
        ...state,
        showBottomBar: false,
        mode: { type: "add" },
        currentInput: { headline: "", exercises: "" },
      };
    }

    case "set-edit-mode": {
      const { id, serializedExercises, date } = action;
      const training = trainings.find((t) => t.id === id);
      const headline = training?.headline || "";

      return {
        ...state,
        showBottomBar: true,
        currentInput: {
          headline,
          exercises: serializedExercises,
        },
        mode: {
          id,
          date,
          type: "edit",
          initialInput: { headline, exercises: serializedExercises },
        },
      };
    }

    case "set-delete-mode": {
      const { id } = action;

      return {
        ...state,
        showBottomBar: false,
        mode: { type: "delete", id },
        currentInput: { headline: "", exercises: "" },
      };
    }

    case "set-mode": {
      const { mode } = action;

      return { ...state, mode };
    }

    case "set-input": {
      const { currentInput } = action;

      return { ...state, currentInput };
    }

    case "open-input": {
      return { ...state, showBottomBar: true };
    }

    case "set-search-term": {
      const { searchTerm } = action;

      return {
        ...state,
        searchTerm,
      };
    }

    case "clear-search-term": {
      return { ...state, searchTerm: "" };
    }

    default: {
      const never: never = action;
      throw Error("Unknown action: " + JSON.stringify(never));
    }
  }
}

export const initialState: TopLevelState = {
  trainings: [],
  searchTerm: "",
  showBottomBar: false,
  mode: { type: "add" },
  currentInput: { headline: "", exercises: "" },
};
