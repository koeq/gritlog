import { memo } from "react";
import { HandleSetEditModeParams } from "./authed-app";
import { getLatestPercentageChanges } from "./get-latest-percentage-change";
import { Action } from "./state-reducer";
import "./styles/trainings.css";
import { TrainingTableWithButtons } from "./training-table-with-buttons";
import { Training } from "./types";

interface TrainingsProps {
  readonly trainings: Training[];
  readonly dispatch: React.Dispatch<Action>;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  readonly handleSetEditMode: ({
    id,
    trainings,
    dispatch,
    textAreaRef,
  }: HandleSetEditModeParams) => void;
}

export const Trainings = ({
  dispatch,
  trainings,
  textAreaRef,
  handleSetEditMode,
}: TrainingsProps): JSX.Element | null => {
  if (trainings.length === 0) {
    return null;
  }

  const latestTraining = trainings[trainings.length - 1];

  const percentageChanges = getLatestPercentageChanges(
    latestTraining,
    trainings
  );

  return (
    <main className="trainings">
      <section>
        {trainings
          .map((training) => {
            return (
              <TrainingTableWithButtons
                key={training.id}
                dispatch={dispatch}
                training={training}
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
              />
            );
          })
          .reverse()}
      </section>
    </main>
  );
};

export const MemoizedTrainings = memo(Trainings);
