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
  const { date, endDate } = training;

  return (
    <div className="training" tabIndex={0}>
      <HeadlineAndDate training={training} dispatch={dispatch} />
      <Values training={training} searchTerm={searchTerm} />
      {endDate && <Time date={date} endDate={endDate} />}
    </div>
  );
};

interface HeadlineDateRowProps {
  readonly training: TrainingType;
  readonly dispatch: Dispatch<Action>;
}

const HeadlineAndDate = ({
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

interface TimeProps {
  readonly date: string;
  readonly endDate: string;
}

const Time = ({ date, endDate }: TimeProps) => {
  const dateObj = new Date(date);
  const endDateObj = new Date(endDate);
  const differenceInMilliseconds = endDateObj.getTime() - dateObj.getTime();

  const differenceInHours = Math.floor(differenceInMilliseconds / 3600000);

  const differenceInMinutes = Math.floor(
    (differenceInMilliseconds % 3600000) / 60000
  );

  const formattedTimeDifference = `${
    differenceInHours < 10 ? "0" : ""
  }${differenceInHours}:${
    differenceInMinutes < 10 ? "0" : ""
  }${differenceInMinutes} h`;

  const timeFormattingOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };
  return (
    <div id="time-row">
      <span>Start:{dateObj.toLocaleTimeString([], timeFormattingOptions)}</span>
      <span>
        End: {endDateObj.toLocaleTimeString([], timeFormattingOptions)}
      </span>
      <span>Duration: {formattedTimeDifference}</span>
    </div>
  );
};
