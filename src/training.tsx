import { Dispatch } from "react";
import { Calendar } from "./calendar";
import { createDateFormat } from "./create-date-format";
import { ExerciseRow } from "./exercise-row";
import { Action } from "./state-reducer";
import "./styles/training.css";
import { Training as TrainingType } from "./types";

interface TrainingProps {
  readonly searchTerm: string;
  readonly training: TrainingType;
  readonly dispatch: Dispatch<Action>;
}

export const Training = ({
  training,
  dispatch,
  searchTerm,
}: TrainingProps): JSX.Element | null => {
  return (
    <div className="training" tabIndex={0}>
      <HeadlineDateRow training={training} dispatch={dispatch} />
      <Values training={training} searchTerm={searchTerm} />
    </div>
  );
};

interface HeadlineDateRowProps {
  readonly training: TrainingType;
  readonly dispatch: Dispatch<Action>;
}

const HeadlineDateRow = ({
  training,
  dispatch,
}: HeadlineDateRowProps): JSX.Element => {
  return (
    <div className="headline-date-row">
      <span id="headline">{training.headline}</span>
      <div className="date">
        {createDateFormat(new Date(training.date), true)}
        <Calendar training={training} dispatch={dispatch} />
      </div>
    </div>
  );
};

interface TrainingValuesProps {
  readonly searchTerm: string;
  readonly training: TrainingType;
}

const Values = ({ training, searchTerm }: TrainingValuesProps): JSX.Element => {
  const { exercises } = training;
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();

  return (
    <>
      {exercises.map((exercise, index) => {
        const weightChange =
          exercise.exerciseName === exercises[index - 1]?.exerciseName;

        const isSearchedExercise = normalizedSearchTerm
          ? exercise.exerciseName?.toLowerCase().includes(normalizedSearchTerm)
          : false;

        return (
          <ExerciseRow
            key={index}
            exercise={exercise}
            weightChange={weightChange}
            isLastExercise={index === exercises.length - 1}
            volumeChanges={training.volumeChanges}
            isSearchedExercise={isSearchedExercise}
          />
        );
      })}
    </>
  );
};
