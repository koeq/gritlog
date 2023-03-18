import { TopLevelState, reducer } from "../state-reducer";
import { Training } from "../types";

let state: TopLevelState;

describe("Mutate global state", () => {
  beforeEach(() => {
    state = {
      trainings: undefined,
      currentInput: "",
      inputOpen: false,
      mode: { type: "add" },
    };
  });

  const currentTraining: Training = {
    date: "someDate",
    id: 0,
    exercises: [
      { exerciseName: "Benchpress", repetitions: "8/8/8", weight: "100.5kg" },
    ],
  };

  it("Add a training", () => {
    const newState = reducer(state, { type: "add", currentTraining });

    expect(newState).toStrictEqual({
      trainings: [currentTraining],
      inputOpen: false,
      mode: { type: "add" },
      currentInput: "",
    });
  });
});
