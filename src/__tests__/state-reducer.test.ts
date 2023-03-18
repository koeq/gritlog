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

  const someTraining: Training = {
    date: "someDate",
    id: 0,
    exercises: [
      { exerciseName: "Benchpress", repetitions: "8/8/8", weight: "100.5kg" },
    ],
  };

  it("Add training", () => {
    const newState = reducer(state, {
      type: "add",
      currentTraining: someTraining,
    });

    expect(newState).toStrictEqual({
      trainings: [someTraining],
      inputOpen: false,
      mode: { type: "add" },
      currentInput: "",
    });
  });

  it("Edit training", () => {
    state = {
      ...state,
      trainings: [someTraining],
    };

    const currentTraining: Training = {
      ...someTraining,
      exercises: [{ ...someTraining.exercises[0], exerciseName: "Squats" }],
    };

    const newState = reducer(state, {
      type: "edit",
      mode: { type: "edit", id: 0, initialInput: "someInitialInput" },
      currentTraining,
    });

    expect(newState).toStrictEqual({
      trainings: [{ ...currentTraining }],
      inputOpen: false,
      mode: { type: "add" },
      currentInput: "",
    });
  });

  it("Delete training", () => {
    state = {
      ...state,
      trainings: [someTraining],
    };

    const newState = reducer(state, {
      type: "delete",
      id: someTraining.id,
    });

    expect(newState).toStrictEqual({
      trainings: [],
      inputOpen: false,
      mode: { type: "add" },
      currentInput: "",
    });
  });
});
