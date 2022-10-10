import { Training } from "../db-handler/types";
import { TrainingTableWithButtons } from "./training-table-with-buttons";
import "./styles/trainings.css";

interface TrainingsProps {
  readonly trainings: Training[] | undefined;
  readonly handleEdit: (id: number) => void;
  readonly handleDelete: (id: number) => void;
}

export const Trainings = ({
  trainings,
  handleEdit,
  handleDelete,
}: TrainingsProps): JSX.Element | null => {
  if (!trainings) {
    return null;
  }

  return (
    <div className="trainings">
      {trainings &&
        trainings
          .map((_, index) => {
            const training = trainings[index];

            return (
              <TrainingTableWithButtons
                training={training}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
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
