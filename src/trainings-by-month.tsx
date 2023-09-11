import { Dispatch, useCallback, useEffect, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { TrainingsByMonth as TrainingByMonthType } from "./group-training-by-month";
import { serializeExercises } from "./serialize-exercises";
import { Action } from "./state-reducer";
import "./styles/trainings-by-month.css";
import { MemoizedTrainingCard } from "./training-card";
import { Training } from "./types";

const OPEN_MONTHS = 2;

interface TrainingsByMonthProps {
  readonly index: number;
  readonly searchTerm: string;
  readonly trainings: Training[];
  readonly dispatch: Dispatch<Action>;
  readonly date: TrainingByMonthType["date"];
  readonly handleSetEditMode: (id: number) => void;
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

export const TrainingsByMonth = ({
  index,
  dispatch,
  trainings,
  searchTerm,
  textAreaRef,
  handleSetEditMode,
  date: { month, year },
}: TrainingsByMonthProps): JSX.Element => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(index < OPEN_MONTHS || searchTerm.length > 0);
  }, [index, searchTerm]);

  const handleRepeat = useCallback(
    (id: number) => {
      const training = trainings.find((training) => training.id === id);

      if (!training) {
        return;
      }

      dispatch({
        type: "repeat",
        currentInput: {
          headline: training.headline || "",
          exercises: serializeExercises(training),
        },
      });
      textAreaRef.current?.focus();
    },
    [trainings, dispatch, textAreaRef]
  );

  return (
    <>
      <div className="date-range">
        <span className="date-range-text">
          {month} {new Date().getFullYear() > year ? year : null}
        </span>
        <button onClick={() => setOpen((prev) => !prev)}>
          {open ? <IoChevronUp size={22} /> : <IoChevronDown size={22} />}
        </button>
      </div>
      {open &&
        trainings.map((training) => {
          return (
            <MemoizedTrainingCard
              key={training.id}
              dispatch={dispatch}
              training={training}
              searchTerm={searchTerm}
              textAreaRef={textAreaRef}
              handleRepeat={handleRepeat}
              handleSetEditMode={handleSetEditMode}
            />
          );
        })}
    </>
  );
};
