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

  it("Set trainings", () => {
    const newState = reducer(state, {
      type: "set-trainings",
      trainings: [someTraining],
    });

    expect(newState).toStrictEqual({
      ...state,
      trainings: [someTraining],
    });
  });

  it("Cancel add", () => {
    state = {
      ...state,
      inputOpen: true,
      currentInput: "some input",
    };

    const newState = reducer(state, {
      type: "cancel-add",
    });

    expect(newState).toStrictEqual({
      ...state,
      inputOpen: false,
      currentInput: "",
    });
  });

  it("Cancel edit", () => {
    state = {
      ...state,
      inputOpen: true,
      currentInput: "some input",
      mode: { type: "edit", id: 1000, initialInput: "some input" },
    };

    const newState = reducer(state, {
      type: "cancel-edit",
    });

    expect(newState).toStrictEqual({
      ...state,
      inputOpen: false,
      currentInput: "",
      mode: { type: "add" },
    });
  });

  it("Set edit mode", () => {
    const newState = reducer(state, {
      type: "set-edit-mode",
      id: 1000,
      serializedTraining: "some serialized training",
    });

    expect(newState).toStrictEqual({
      ...state,
      inputOpen: true,
      currentInput: "some serialized training",
      mode: {
        type: "edit",
        id: 1000,
        initialInput: "some serialized training",
      },
    });
  });

  it("Set delete mode", () => {
    state = {
      ...state,
      inputOpen: true,
      currentInput: "some input",
    };

    const newState = reducer(state, {
      type: "set-delete-mode",
      id: 1000,
    });

    expect(newState).toStrictEqual({
      ...state,
      inputOpen: false,
      currentInput: "",
      mode: {
        type: "delete",
        id: 1000,
      },
    });
  });
});
