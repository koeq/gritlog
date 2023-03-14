import { memo } from "react";
import { Action } from "./state-reducer";
import "./styles/trainings.css";
import { TrainingTableWithButtons } from "./training-table-with-buttons";
import { Training } from "./types";

interface TrainingsProps {
  readonly trainings: Training[];
  readonly handleSetEditMode: (id: number) => void;
  readonly dispatch: React.Dispatch<Action>;
}

export const Trainings = ({
  trainings,
  handleSetEditMode,
  dispatch,
}: TrainingsProps): JSX.Element | null => {
  if (trainings.length === 0) {
    return null;
  }

  return (
    <section className="trainings">
      {trainings
        .map((training) => (
          <TrainingTableWithButtons
            key={training.id}
            dispatch={dispatch}
            training={training}
            handleSetEditMode={handleSetEditMode}
          />
        ))
        .reverse()}
    </section>
  );
};

export const MemoizedTrainings = memo(Trainings);
