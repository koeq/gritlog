import { getVolumePerExercise } from "../get-volume-per-exercise";
import { serializeExercises } from "../serialize-exercises";
import { TopLevelState, reducer } from "../state-reducer";
import { Training } from "../types";

let state: TopLevelState;

describe("Mutate global state", () => {
  beforeEach(() => {
    state = {
      trainings: [],
      currentInput: { headline: "", exercises: "" },
      showInputSection: false,
      mode: { type: "add" },
      searchTerm: "",
    };
  });

  const someTraining: Training = {
    date: "someDate",
    headline: "",
    id: 0,
    exercises: [
      { exerciseName: "Benchpress", repetitions: "8/8/8", weight: "100.5kg" },
    ],
    exerciseVolumeMap: {
      Benchpress: 2412,
    },
    volumeChanges: null,
  };

  it("Add training", () => {
    const newState = reducer(state, {
      type: "add",
      currentTraining: someTraining,
    });

    expect(newState).toStrictEqual({
      trainings: [someTraining],
      showInputSection: false,
      mode: { type: "add" },
      currentInput: { headline: "", exercises: "" },
      searchTerm: "",
    });
  });

  it("Edit training", () => {
    state = {
      ...state,
      trainings: [someTraining],
    };

    const exercises = [
      { ...someTraining.exercises[0], exerciseName: "Squats" },
    ];

    const currentTraining: Training = {
      ...someTraining,
      exercises,
      exerciseVolumeMap: getVolumePerExercise(exercises),
    };

    const newState = reducer(state, {
      type: "edit",
      mode: {
        type: "edit",
        id: 0,
        initialInput: {
          headline: "some initial headline ",
          exercises: "some initial exercises",
        },
        date: "some date",
      },
      currentTraining,
    });

    expect(newState).toStrictEqual({
      trainings: [{ ...currentTraining }],
      showInputSection: false,
      mode: { type: "add" },
      currentInput: { headline: "", exercises: "" },
      searchTerm: "",
    });
  });

  it("Repeat training", () => {
    state = {
      ...state,
      trainings: [someTraining],
    };

    const newState = reducer(state, {
      type: "repeat",
      currentInput: {
        headline: someTraining.headline || "",
        exercises: serializeExercises(someTraining),
      },
    });

    expect(newState).toStrictEqual({
      ...state,
      showInputSection: true,
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
      showInputSection: false,
      mode: { type: "add" },
      currentInput: { headline: "", exercises: "" },
      searchTerm: "",
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
      showInputSection: true,
      currentInput: { headline: "", exercises: "" },
    };

    const newState = reducer(state, {
      type: "cancel-add",
    });

    expect(newState).toStrictEqual({
      ...state,
      showInputSection: false,
      currentInput: { headline: "", exercises: "" },
    });
  });

  it("Cancel edit", () => {
    state = {
      ...state,
      showInputSection: true,
      currentInput: { headline: "", exercises: "" },
      mode: {
        type: "edit",
        id: 1000,
        initialInput: {
          headline: "some initial headline ",
          exercises: "some initial exercises",
        },
        date: "some date",
      },
    };

    const newState = reducer(state, {
      type: "cancel-edit",
    });

    expect(newState).toStrictEqual({
      ...state,
      showInputSection: false,
      currentInput: { headline: "", exercises: "" },
      mode: { type: "add" },
    });
  });

  it("Set edit mode", () => {
    const newState = reducer(state, {
      type: "set-edit-mode",
      id: 1000,
      serializedExercises: "some exercises",
      date: "some date",
    });

    expect(newState).toStrictEqual({
      ...state,
      showInputSection: true,
      currentInput: { headline: "", exercises: "some exercises" },
      mode: {
        type: "edit",
        id: 1000,
        initialInput: {
          headline: "",
          exercises: "some exercises",
        },
        date: "some date",
      },
    });
  });

  it("Set delete mode", () => {
    state = {
      ...state,
      showInputSection: true,
      currentInput: { headline: "", exercises: "" },
    };

    const newState = reducer(state, {
      type: "set-delete-mode",
      id: 1000,
    });

    expect(newState).toStrictEqual({
      ...state,
      showInputSection: false,
      currentInput: { headline: "", exercises: "" },
      mode: {
        type: "delete",
        id: 1000,
      },
    });
  });
});
