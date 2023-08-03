import { Dispatch, Fragment, memo, useEffect, useMemo, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { HandleSetEditModeParams } from "./authed-app";
import { useTopLevelState } from "./context";
import { NoFilterResult } from "./filter-trainings";
import { getLatestPercentageChanges } from "./get-latest-percentage-change";
import {
  TrainingsByMonth as TrainingByMonthType,
  groupTrainingsByMonth,
} from "./group-training-by-month";
import { serializeTraining } from "./serialize-training";
import { Action } from "./state-reducer";
import "./styles/trainings.css";
import { TrainingTableWithButtons } from "./training-table-with-buttons";
import { Mode, Training } from "./types";

const OPEN_MONTHS = 2;

interface TrainingsProps {
  readonly mode: Mode;
  readonly dispatch: Dispatch<Action>;
  readonly trainings: Training[];
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  readonly handleSetEditMode: ({
    id,
    trainings,
    dispatch,
    textAreaRef,
  }: HandleSetEditModeParams) => void;
}

export const Trainings = ({
  trainings,
  textAreaRef,
  handleSetEditMode,
}: TrainingsProps): JSX.Element | null => {
  const [{ searchTerm }] = useTopLevelState();
  const latestTraining: Training | undefined = trainings[0];
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();

  const percentageChanges =
    latestTraining && !normalizedSearchTerm
      ? getLatestPercentageChanges(latestTraining, trainings)
      : null;

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
                index={index}
                date={date}
                trainings={trainings}
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

interface TrainingsByMonthProps {
  date: TrainingByMonthType["date"];
  trainings: Training[];
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  percentageChanges: Record<string, number> | null;
  handleSetEditMode: (params: HandleSetEditModeParams) => void;
  index: number;
}

export const TrainingsByMonth = ({
  date: { month, year },
  trainings,
  textAreaRef,
  percentageChanges,
  handleSetEditMode,
  index,
}: TrainingsByMonthProps): JSX.Element => {
  const [{ mode, searchTerm }, dispatch] = useTopLevelState();
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const shouldBeOpen = index < OPEN_MONTHS || searchTerm.length > 0;
    setOpen((prev) => (shouldBeOpen !== prev ? shouldBeOpen : prev));
  }, [index, searchTerm]);

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
            <TrainingTableWithButtons
              key={training.id}
              dispatch={dispatch}
              textAreaRef={textAreaRef}
              training={training}
              editing={mode.type === "edit" && mode.id === training.id}
              percentageChanges={
                training.id === percentageChanges?.trainingId
                  ? percentageChanges
                  : null
              }
              handleSetEditMode={() =>
                handleSetEditMode({
                  id: training.id,
                  trainings,
                  dispatch,
                  textAreaRef,
                })
              }
              handleRepeat={() =>
                handleRepeat({
                  id: training.id,
                  trainings,
                  dispatch,
                  textAreaRef,
                })
              }
            />
          );
        })}
    </>
  );
};

export const MemoizedTrainings = memo(Trainings);

interface HandleRepeatParams {
  id: number;
  trainings: Training[];
  dispatch: Dispatch<Action>;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

const handleRepeat = ({
  id,
  trainings,
  dispatch,
  textAreaRef,
}: HandleRepeatParams) => {
  const training = trainings.find((training) => training.id === id);

  if (!training) {
    return;
  }

  dispatch({ type: "repeat", currentInput: serializeTraining(training) });
  textAreaRef.current?.focus();
};
