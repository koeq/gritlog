import { memo } from "react";
import "./styles/trainings.css";
import { TrainingTableWithButtons } from "./training-table-with-buttons";
import { Mode, Training } from "./types";

interface TrainingsProps {
  readonly trainings: Training[];
  readonly handleSetEditMode: (id: number) => void;
  readonly setMode: (value: Mode | ((val: Mode) => Mode)) => void;
}

export const Trainings = ({
  trainings,
  handleSetEditMode,
  setMode,
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
            setMode={setMode}
            training={training}
            handleSetEditMode={handleSetEditMode}
          />
        ))
        .reverse()}
    </section>
  );
};

export const MemoizedTrainings = memo(Trainings);
