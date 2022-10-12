import { Training } from "../db-handler/types";
import { TrainingTableWithButtons } from "./training-table-with-buttons";
import { Deletion } from "./authed-app";
import "./styles/trainings.css";

interface TrainingsProps {
  readonly trainings: Training[] | [];
  readonly handleSetEditMode: (id: number) => void;
  readonly setDeletion: (
    value: Deletion | ((val: Deletion) => Deletion)
  ) => void;
}

export const Trainings = ({
  trainings,
  handleSetEditMode,
  setDeletion,
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
              training={training}
              handleSetEditMode={handleSetEditMode}
              setDeletion={setDeletion}
              key={index}
            />
          );
        })
        // TO DO: CHECK
        // why does this not work before map?
        .reverse()}
    </div>
  );
};
