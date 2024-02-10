import { Dispatch, useCallback, useEffect, useMemo, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { TrainingsByMonth as TrainingByMonthType } from "./group-training-by-month";
import { serializeExercises } from "./serialize-exercises";
import { Action } from "./state-reducer";
import "./styles/trainings-by-month.css";
import { MemoizedTrainingCard } from "./training-card";
import { Training } from "./types";

const OPEN_MONTHS = 1;

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

  const monthIndicator = useMemo(
    () => `${month.slice(0, 3)} ${new Date().getFullYear() > year ? year : ""}`,
    [month, year]
  );

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
      <button
        className="month-indicator"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="month-indicator-text">{monthIndicator}</span>
        {open ? (
          <IoChevronUp color="#8E8E93" size={22} />
        ) : (
          <IoChevronDown color="#8E8E93" size={22} />
        )}
      </button>
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
