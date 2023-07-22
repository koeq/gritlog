import { Dispatch, Fragment, memo, useMemo } from "react";
import { HandleSetEditModeParams } from "./authed-app";
import { useTopLevelState } from "./context";
import { NoFilterResult } from "./filter-trainings";
import { getLatestPercentageChanges } from "./get-latest-percentage-change";
import {
  createDateFormat,
  groupTrainingsByWeek,
} from "./group-training-by-weeks";
import { serializeTraining } from "./serialize-training";
import { Action } from "./state-reducer";
import "./styles/trainings.css";
import { TrainingTableWithButtons } from "./training-table-with-buttons";
import { Mode, Training } from "./types";

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

  const trainingsByWeek = useMemo(
    // Displaying the list with flex-direction: 'column-reverse' is an
    // optimisation which could be made here instead of this.
    // Downside: components structure is upside down then in the JSX and
    // might be confusing.
    () => groupTrainingsByWeek(trainings),
    [trainings]
  );

  if (normalizedSearchTerm && trainings.length === 0) {
    return <NoFilterResult searchTerm={searchTerm} />;
  }

  return (
    <main className="trainings">
      <section>
        {trainingsByWeek.map(({ weekStart, weekEnd, trainings }, index) => {
          return (
            <Fragment key={weekStart.toString()}>
              <TrainingsByWeek
                weekEnd={weekEnd}
                weekStart={weekStart}
                trainings={trainings}
                textAreaRef={textAreaRef}
                percentageChanges={percentageChanges}
                handleSetEditMode={handleSetEditMode}
              />
              {index !== trainingsByWeek.length - 1 && (
                <hr className="training-group-separator" />
              )}
            </Fragment>
          );
        })}
      </section>
    </main>
  );
};

interface TrainingsByWeekProps {
  weekStart: Date;
  weekEnd: Date;
  trainings: Training[];
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  percentageChanges: Record<string, number> | null;
  handleSetEditMode: (params: HandleSetEditModeParams) => void;
}

export const TrainingsByWeek = ({
  weekStart,
  weekEnd,
  trainings,
  textAreaRef,
  percentageChanges,
  handleSetEditMode,
}: TrainingsByWeekProps): JSX.Element => {
  const [{ mode }, dispatch] = useTopLevelState();

  return (
    <>
      <div className="date-range">
        <span className="date-range-text">{`${createDateFormat(
          weekStart
        )} — ${createDateFormat(weekEnd)}`}</span>
      </div>
      {trainings.map((training) => {
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
