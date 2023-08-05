import { Fragment } from "react";
import "./styles/exercise-row.css";
import { Exercise } from "./types";

interface ExerciseRowProps {
  exercise: Exercise;
  weightChange: boolean;
  isLastExercise: boolean;
  percentageChanges: Record<string, number> | null;
  isSearchedExercise: boolean | undefined;
}

export const ExerciseRow = ({
  exercise,
  weightChange,
  isLastExercise,
  percentageChanges,
  isSearchedExercise,
}: ExerciseRowProps): JSX.Element => {
  const { exerciseName, repetitions } = exercise;

  const percentageChange = exerciseName
    ? percentageChanges?.[exerciseName] ?? null
    : null;

  const sign = percentageChange ? (percentageChange > 0 ? "↑" : "↓") : "";
  const weight = renderWeight(parseWeight(exercise.weight));
  const reps = renderReps(parseReps(repetitions));

  return (
    <div className={`exercise-row ${isLastExercise ? "last-row" : ""}`}>
      <div
        id="exercise"
        className={`row ${isSearchedExercise ? "searched-exercise-name" : ""}`}
      >
        {weightChange ? "" : exerciseName ?? "—"}
      </div>
      <div className="row" id="weight">
        {weight}
      </div>
      <div className="row" id="repetitions">
        {reps}
      </div>
      {percentageChange !== null && !weightChange ? (
        <div
          id="change"
          className={
            percentageChange === 0
              ? `zero row"`
              : percentageChange > 0
              ? `positive row`
              : `negative row`
          }
        >
          {sign}
          {Math.abs(percentageChange).toFixed(0)}%
        </div>
      ) : (
        <div className={"row"} id="change" />
      )}
    </div>
  );
};

// This should be expressed in the type of weight and therefore in the database scheme.
// In order to prevent a database migration for now we handle this here.
const parseWeight = (
  weight: string | null | undefined
): { value: string; unit: string } | undefined => {
  if (!weight) {
    return;
  }

  const [value, unit] = weight.split(/(kg|lbs)/);

  if (!value || !unit) {
    return;
  }

  return { value, unit };
};

const renderWeight = (weight: { value: string; unit: string } | undefined) => {
  return weight ? (
    <>
      {weight.value}
      <span className="text-off">{` ${weight.unit}`}</span>
    </>
  ) : (
    "—"
  );
};

const parseReps = (repetitions: string | null | undefined): string[] =>
  repetitions ? repetitions.split("/") : [];

const renderReps = (reps: string[]): JSX.Element => {
  if (reps.length === 0) {
    return <span>—</span>;
  }
  const firstRep = reps[0];

  if (reps.length > 1 && reps.every((rep) => rep === firstRep)) {
    return (
      <>
        <span>{reps.length}</span>
        <span>x</span>
        <span>{firstRep}</span>
      </>
    );
  }

  return (
    <>
      {reps.map((rep, index) => (
        <Fragment key={index}>
          <span>{rep}</span>
          {index !== reps.length - 1 && <span>/</span>}
        </Fragment>
      ))}
    </>
  );
};
