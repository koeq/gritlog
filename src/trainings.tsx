import { Training } from "../db-handler/types";
import { TrainingTableWithButtons } from "./training-table-with-buttons";
import { Mode } from "./types";
import "./styles/trainings.css";

interface TrainingsProps {
  readonly trainings: Training[] | [];
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
    <div className="trainings">
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
        // TO DO: CHECK
        // why does this not work before map?
        .reverse()}
    </div>
  );
};
