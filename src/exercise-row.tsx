import { Fragment } from "react";
import "./styles/exercise-row.css";
import { Exercise } from "./types";
import { ParsedWeight, parseWeight } from "./utils/parse-weight";
import { parseReps } from "./utils/parse-reps";

interface ExerciseRowProps {
  exercise: Exercise;
  weightChange: boolean;
  isLastExercise: boolean;
  isSearchedExercise: boolean | undefined;
  percentageChanges: Record<string, number> | null;
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
        <div id="change" className={"row"}>
          <span
            className={`${
              percentageChange === 0
                ? "zero"
                : percentageChange > 0
                ? "positive"
                : "negative"
            } change`}
          >
            {`${sign}${Math.abs(percentageChange).toFixed(0)}%`}
          </span>
        </div>
      ) : (
        <div className={"row"} id="change" />
      )}
    </div>
  );
};

const renderWeight = (weight: ParsedWeight | undefined) => {
  return weight ? (
    <>
      {weight.value}
      <span className="text-off">{` ${weight.unit}`}</span>
    </>
  ) : (
    "—"
  );
};

const renderReps = (reps: number[]): JSX.Element => {
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
