import { TrainingTable } from "./training-table";
import { Trainings } from "../db-handler/types";
import "./styles/trainings.css";
import { TrainingTableWithButtons } from "./training-table-with-buttons";

interface TrainingsTableProps {
  readonly trainings: Trainings | undefined;
  readonly handleEdit: (id: number) => void;
  readonly handleDelete: (id: number) => void;
}

export const TrainingsTable = ({
  trainings,
  handleEdit,
  handleDelete,
}: TrainingsTableProps): JSX.Element | null => {
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
