import { Dispatch } from "react";
import { IoCaretForward, IoPause } from "react-icons/io5";
import { Calendar } from "./calendar";
import { createDateFormat } from "./create-date-format";
import { ExerciseRow } from "./exercise-row";
import { Action } from "./state-reducer";
import "./styles/training.css";
import { Training as TrainingType } from "./types";
import { MILLISECONDS_IN_HOUR } from "./utils/date";

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

  const differenceInHours = Math.floor(
    differenceInMilliseconds / MILLISECONDS_IN_HOUR
  );

  const differenceInMinutes = Math.floor(
    (differenceInMilliseconds % MILLISECONDS_IN_HOUR) / 60000
  );

  const formattedTimeDifference = `${
    differenceInHours < 10 ? "0" : ""
  }${differenceInHours}:${
    differenceInMinutes < 10 ? "0" : ""
  }${differenceInMinutes} h`;

  const timeFormattingOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return (
    <div id="time-row">
      <div className="time-row-item">
        <IoCaretForward className="time-row-icon" size={18} />
        {dateObj.toLocaleTimeString([], timeFormattingOptions)}
      </div>
      <div className="time-row-item">
        <IoPause className="time-row-icon" size={18} />
        {endDateObj.toLocaleTimeString([], timeFormattingOptions)}
      </div>
      <div className="time-row-item">
        <TimeOutline />
        <span>{formattedTimeDifference}</span>
      </div>
    </div>
  );
};

const TimeOutline = () => {
  return (
    <svg
      style={{ paddingRight: "2px" }}
      fill="currentColor"
      strokeWidth="40"
      viewBox="0 0 512 512"
      className="time-row-icon"
      height="19"
      width="19"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
    >
      <path
        fill="none"
        strokeMiterlimit="10"
        strokeWidth="40"
        d="M256 64C150 64 64 150 64 256s86 192 192 192 192-86 192-192S362 64 256 64z"
      ></path>
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="40"
        d="M256 128v144h96"
      ></path>
    </svg>
  );
};
