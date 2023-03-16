import { EditMode, Mode, Training } from "./types";

type TopLevelState = {
  trainings: Training[] | undefined;
  currentInput: string;
  inputOpen: boolean;
  mode: Mode;
};

export type Action =
  | { type: "add"; currentTraining: Training }
  | { type: "edit"; mode: EditMode; currentTraining: Training }
  | { type: "delete"; id: number }
  | { type: "set-training"; trainings: Training[] }
  | { type: "cancel-add" }
  | { type: "cancel-edit" }
  | { type: "set-edit-mode"; id: number; serializedTraining: string }
  | { type: "set-mode"; mode: Mode }
  | { type: "set-input"; currentInput: string }
  | { type: "open-input" };

export function reducer(state: TopLevelState, action: Action): TopLevelState {
  const { trainings } = state;

  const nextTrainingsId = trainings
    ? trainings[trainings.length - 1].id + 1
    : 0;

  switch (action.type) {
    case "add": {
      const { currentTraining } = action;

      return {
        ...state,
        currentInput: "",
        inputOpen: false,
        mode: { type: "add", id: nextTrainingsId },

        trainings: trainings
          ? [...trainings, currentTraining]
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
        mode: { type: "add", id: nextTrainingsId },

        trainings: trainings?.map((training) =>
          training.id === id ? { ...currentTraining, id } : training
        ),
      };
    }

    case "delete": {
      const { id } = action;

      return {
        ...state,
        inputOpen: false,
        currentInput: "",
        trainings: trainings?.filter(({ id: pastId }) => pastId !== id),

        mode: {
          type: "add",
          id: nextTrainingsId,
        },
      };
    }

    case "set-training": {
      const { trainings } = action;

      return {
        ...state,
        trainings,
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
        mode: { type: "add", id: nextTrainingsId },
      };
    }

    case "set-edit-mode": {
      const { id, serializedTraining } = action;

      return {
        ...state,
        currentInput: serializedTraining,
        inputOpen: true,
        mode: { type: "edit", id, initialInput: serializedTraining },
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
      throw Error("Unknown action: " + JSON.stringify(action));
    }
  }
}

export const initialState: TopLevelState = {
  trainings: undefined,
  currentInput: "",
  inputOpen: false,
  mode: { type: "add", id: -1 },
};
