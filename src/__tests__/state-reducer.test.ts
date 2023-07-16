import { serializeTraining } from "../serialize-training";
import { TopLevelState, reducer } from "../state-reducer";
import { Training } from "../types";

let state: TopLevelState;

describe("Mutate global state", () => {
  beforeEach(() => {
    state = {
      trainings: undefined,
      currentInput: "",
      showBottomBar: false,
      mode: { type: "add" },
      searchTerm: "",
    };
  });

  const someTraining: Training = {
    date: "someDate",
    headline: null,
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
      showBottomBar: false,
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
      mode: {
        type: "edit",
        id: 0,
        initialInput: "someInitialInput",
        date: "some date",
      },
      currentTraining,
    });

    expect(newState).toStrictEqual({
      trainings: [{ ...currentTraining }],
      showBottomBar: false,
      mode: { type: "add" },
      currentInput: "",
    });
  });

  it("Repeat training", () => {
    state = {
      ...state,
      trainings: [someTraining],
    };

    const newState = reducer(state, {
      type: "repeat",
      currentInput: serializeTraining(someTraining),
    });

    expect(newState).toStrictEqual({
      ...state,
      showBottomBar: true,
      mode: { type: "add" },
      currentInput: newState.currentInput,
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
      showBottomBar: false,
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
      showBottomBar: true,
      currentInput: "some input",
    };

    const newState = reducer(state, {
      type: "cancel-add",
    });

    expect(newState).toStrictEqual({
      ...state,
      showBottomBar: false,
      currentInput: "",
    });
  });

  it("Cancel edit", () => {
    state = {
      ...state,
      showBottomBar: true,
      currentInput: "some input",
      mode: {
        type: "edit",
        id: 1000,
        initialInput: "some input",
        date: "some date",
      },
    };

    const newState = reducer(state, {
      type: "cancel-edit",
    });

    expect(newState).toStrictEqual({
      ...state,
      showBottomBar: false,
      currentInput: "",
      mode: { type: "add" },
    });
  });

  it("Set edit mode", () => {
    const newState = reducer(state, {
      type: "set-edit-mode",
      id: 1000,
      serializedTraining: "some serialized training",
      date: "some date",
    });

    expect(newState).toStrictEqual({
      ...state,
      showBottomBar: true,
      currentInput: "some serialized training",
      mode: {
        type: "edit",
        id: 1000,
        initialInput: "some serialized training",
        date: "some date",
      },
    });
  });

  it("Set delete mode", () => {
    state = {
      ...state,
      showBottomBar: true,
      currentInput: "some input",
    };

    const newState = reducer(state, {
      type: "set-delete-mode",
      id: 1000,
    });

    expect(newState).toStrictEqual({
      ...state,
      showBottomBar: false,
      currentInput: "",
      mode: {
        type: "delete",
        id: 1000,
      },
    });
  });
});
