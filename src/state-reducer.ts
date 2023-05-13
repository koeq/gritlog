import { EditMode, Mode, Training } from "./types";
import { sortTrainingsByDate } from "./utils/sort-trainings-by-date";

export type TopLevelState = {
  trainings: Training[] | undefined;
  currentInput: string;
  inputOpen: boolean;
  mode: Mode;
};

export type Action =
  | { type: "add"; currentTraining: Training }
  | { type: "edit"; mode: EditMode; currentTraining: Training }
  | { type: "repeat"; currentInput: string }
  | { type: "delete"; id: number }
  | { type: "set-trainings"; trainings: Training[] }
  | { type: "cancel-add" }
  | { type: "cancel-edit" }
  | {
      type: "set-edit-mode";
      id: number;
      serializedTraining: string;
      date: string;
    }
  | { type: "set-delete-mode"; id: number }
  | { type: "set-mode"; mode: Mode }
  | { type: "set-input"; currentInput: string }
  | { type: "open-input" };

export function reducer(state: TopLevelState, action: Action): TopLevelState {
  const { trainings } = state;

  switch (action.type) {
    case "add": {
      const { currentTraining } = action;

      return {
        ...state,
        currentInput: "",
        inputOpen: false,
        mode: { type: "add" },

        trainings: trainings
          ? sortTrainingsByDate([...trainings, currentTraining])
          : [currentTraining],
      };
    }

    case "edit": {
      const {
        mode: { id },
        currentTraining,
      } = action;

      return {
        ...state,
        currentInput: "",
        inputOpen: false,
        mode: { type: "add" },

        trainings: trainings?.map((training) =>
          training.id === id ? { ...currentTraining, id } : training
        ),
      };
    }

    case "repeat": {
      const { currentInput } = action;

      return {
        ...state,
        currentInput,
        inputOpen: true,
        mode: { type: "add" },
      };
    }

    case "delete": {
      const { id } = action;

      return {
        ...state,
        trainings: trainings?.filter(({ id: pastId }) => pastId !== id),

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
        inputOpen: false,
        currentInput: "",
      };
    }

    case "cancel-edit": {
      return {
        ...state,
        inputOpen: false,
        currentInput: "",
        mode: { type: "add" },
      };
    }

    case "set-edit-mode": {
      const { id, serializedTraining, date } = action;

      return {
        ...state,
        currentInput: serializedTraining,
        inputOpen: true,
        mode: { type: "edit", id, initialInput: serializedTraining, date },
      };
    }

    case "set-delete-mode": {
      const { id } = action;

      return {
        ...state,
        mode: { type: "delete", id },
        currentInput: "",
        inputOpen: false,
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
      return { ...state, inputOpen: true };
    }

    default: {
      const never: never = action;
      throw Error("Unknown action: " + JSON.stringify(never));
    }
  }
}

export const initialState: TopLevelState = {
  trainings: undefined,
  currentInput: "",
  inputOpen: false,
  mode: { type: "add" },
};
