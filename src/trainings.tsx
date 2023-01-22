import { memo } from "react";
import { Training } from "../lambdas/db-handler/types";
import "./styles/trainings.css";
import { TrainingTableWithButtons } from "./training-table-with-buttons";
import { Mode } from "./types";

interface TrainingsProps {
  readonly trainings: Training[] | [];
  readonly handleSetEditMode: (id: number) => void;
  readonly setMode: (value: Mode | ((val: Mode) => Mode)) => void;
}

const Trainings = ({
  trainings,
  handleSetEditMode,
  setMode,
}: TrainingsProps): JSX.Element | null => {
  if (trainings.length === 0) {
    return null;
  }

  return (
    <div className="trainings">
      <div className="horizontal-rule" />
      {trainings
        .map((_, index) => {
          const training = trainings[index];

          return (
            <TrainingTableWithButtons
              key={index}
              setMode={setMode}
              training={training}
              handleSetEditMode={handleSetEditMode}
            />
          );
        })
        .reverse()}
    </div>
  );
};

export const MemoizedTrainings = memo(Trainings);
