import { Dispatch, Fragment, memo, useMemo } from "react";
import { NoFilterResult } from "./filter-trainings";
import { getVolumeChanges } from "./get-volume-changes";
import { groupTrainingsByMonth } from "./group-training-by-month";
import { Action } from "./state-reducer";
import "./styles/trainings.css";
import { TrainingsByMonth } from "./trainings-by-month";
import { Mode, Training } from "./types";

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
      ? getVolumeChanges(latestTraining, trainings)
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
