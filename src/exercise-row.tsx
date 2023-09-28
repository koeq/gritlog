import { Fragment } from "react";
import "./styles/exercise-row.css";
import { Exercise } from "./types";
import { parseReps } from "./utils/parse-reps";
import { ParsedWeight, parseWeight } from "./utils/parse-weight";

interface ExerciseRowProps {
  exercise: Exercise;
  weightChange: boolean;
  isLastExercise: boolean;
  isSearchedExercise: boolean | undefined;
  volumeChanges: Record<string, number> | null;
}

export const ExerciseRow = ({
  exercise,
  weightChange,
  isLastExercise,
  volumeChanges,
  isSearchedExercise,
}: ExerciseRowProps): JSX.Element => {
  const { exerciseName, repetitions } = exercise;

  const volumeChange = exerciseName
    ? volumeChanges?.[exerciseName] ?? null
    : null;

  const sign = volumeChange ? (volumeChange > 0 ? "↑" : "↓") : "";
  const weight = renderWeight(parseWeight(exercise.weight));
  const reps = renderReps(parseReps(repetitions));

  return (
    <div className={`exercise-row ${isLastExercise ? "last-row" : ""}`}>
      <span
        id="exercise"
        className={`row ${isSearchedExercise ? "searched-exercise-name" : ""}`}
      >
        {weightChange ? "" : exerciseName ?? "—"}
      </span>
      <span id="weight" className="row">
        {weight}
      </span>
      <span id="repetitions" className="row">
        {reps}
      </span>
      {volumeChange !== null && !weightChange ? (
        <div id="change" className={"row"}>
          <span
            className="change"
            id={
              volumeChange === 0
                ? "equal"
                : volumeChange > 0
                ? "progress"
                : "regress"
            }
          >
            {`${sign}${Math.abs(volumeChange).toFixed(0)}%`}
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
    <>—</>
  );
};

const renderReps = (reps: number[]): JSX.Element => {
  if (reps.length === 0) {
    return <>—</>;
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
