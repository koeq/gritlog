import { Dispatch, Fragment, memo, useMemo } from "react";
import { HandleSetEditModeParams } from "./authed-app";
import { useTopLevelState } from "./context";
import { getLatestPercentageChanges } from "./get-latest-percentage-change";
import {
  createDateFormat,
  groupTrainingsByWeek,
} from "./group-training-by-weeks";
import { serializeTraining } from "./serialize-training";
import { Action } from "./state-reducer";
import "./styles/trainings.css";
import { TrainingTableWithButtons } from "./training-table-with-buttons";
import { Training } from "./types";

interface TrainingsProps {
  readonly trainings: Training[];
  readonly handleSetEditMode: ({
    id,
    trainings,
    dispatch,
    textAreaRef,
  }: HandleSetEditModeParams) => void;
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

export const Trainings = ({
  trainings,
  textAreaRef,
  handleSetEditMode,
}: TrainingsProps): JSX.Element | null => {
  const [{ mode }, dispatch] = useTopLevelState();

  const groupedTrainings = useMemo(
    // Displaying the list with flex-direction: 'column-reverse' is an
    // optimisation which could be made here instead of this.
    // Downside: components structure is upside down then in the JSX and
    // might be confusing.
    () => groupTrainingsByWeek(trainings),
    [trainings]
  );

  const latestTraining: Training | undefined = trainings[0];

  const percentageChanges = latestTraining
    ? getLatestPercentageChanges(latestTraining, trainings)
    : null;

  return (
    <main className="trainings">
      <section>
        {groupedTrainings.map(({ startDate, endDate, trainings }, index) => {
          return (
            <Fragment key={startDate.toString()}>
              <div className="date-range">
                <span className="date-range-text">{`${createDateFormat(
                  startDate
                )} — ${createDateFormat(endDate)}`}</span>
              </div>
              {trainings.map((training) => {
                return (
                  <TrainingTableWithButtons
                    key={training.id}
                    dispatch={dispatch}
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

              {index !== groupedTrainings.length - 1 && (
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
