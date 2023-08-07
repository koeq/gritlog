import {
  Dispatch,
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { NoFilterResult } from "./filter-trainings";
import { getLatestPercentageChanges } from "./get-latest-percentage-change";
import {
  TrainingsByMonth as TrainingByMonthType,
  groupTrainingsByMonth,
} from "./group-training-by-month";
import { serializeTraining } from "./serialize-training";
import { Action } from "./state-reducer";
import "./styles/trainings.css";
import { MemoizedTrainingCard } from "./training-card";
import { Mode, Training } from "./types";

const OPEN_MONTHS = 2;

interface TrainingsProps {
  readonly mode: Mode;
  readonly searchTerm: string;
  readonly trainings: Training[];
  readonly dispatch: Dispatch<Action>;
  readonly handleSetEditMode: (id: number) => void;
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

export const Trainings = ({
  mode,
  dispatch,
  trainings,
  searchTerm,
  textAreaRef,
  handleSetEditMode,
}: TrainingsProps): JSX.Element | null => {
  const latestTraining: Training | undefined = trainings[0];
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();

  const percentageChanges = useMemo(() => {
    return latestTraining && !normalizedSearchTerm
      ? getLatestPercentageChanges(latestTraining, trainings)
      : null;
  }, [latestTraining, normalizedSearchTerm, trainings]);

  const trainingsByMonth = useMemo(
    () => groupTrainingsByMonth(trainings),
    [trainings]
  );

  if (normalizedSearchTerm && trainings.length === 0) {
    return <NoFilterResult searchTerm={searchTerm} />;
  }

  return (
    <main className="trainings">
      <section>
        {trainingsByMonth.map(({ trainings, date }, index) => {
          return (
            <Fragment key={`${date.month}-${date.year}`}>
              <TrainingsByMonth
                date={date}
                mode={mode}
                index={index}
                dispatch={dispatch}
                trainings={trainings}
                searchTerm={searchTerm}
                textAreaRef={textAreaRef}
                percentageChanges={percentageChanges}
                handleSetEditMode={handleSetEditMode}
              />
              {index !== trainingsByMonth.length - 1 && (
                <hr className="training-group-separator" />
              )}
            </Fragment>
          );
        })}
      </section>
    </main>
  );
};

export const MemoizedTrainings = memo(Trainings);

interface TrainingsByMonthProps {
  readonly mode: Mode;
  readonly index: number;
  readonly searchTerm: string;
  readonly trainings: Training[];
  readonly dispatch: Dispatch<Action>;
  readonly date: TrainingByMonthType["date"];
  readonly handleSetEditMode: (id: number) => void;
  readonly percentageChanges: Record<string, number> | null;
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

export const TrainingsByMonth = ({
  mode,
  index,
  dispatch,
  trainings,
  searchTerm,
  textAreaRef,
  percentageChanges,
  handleSetEditMode,
  date: { month, year },
}: TrainingsByMonthProps): JSX.Element => {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const shouldBeOpen = index < OPEN_MONTHS || searchTerm.length > 0;
    setOpen((prev) => (shouldBeOpen !== prev ? shouldBeOpen : prev));
  }, [index, searchTerm]);

  const handleRepeat = useCallback(
    (id: number) => {
      const training = trainings.find((training) => training.id === id);

      if (!training) {
        return;
      }

      dispatch({ type: "repeat", currentInput: serializeTraining(training) });
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
              editing={mode.type === "edit" && mode.id === training.id}
              percentageChanges={
                training.id === percentageChanges?.trainingId
                  ? percentageChanges
                  : null
              }
            />
          );
        })}
    </>
  );
};
