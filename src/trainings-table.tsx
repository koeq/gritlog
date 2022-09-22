import "./styles/trainings-table.css";
import { TrainingTable } from "./training-table";
import { Trainings } from "../db-handler/types";

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
    <div className="trainings-table">
      {trainings &&
        trainings
          .map((_, index) => {
            const training = trainings[index];

            return (
              <div className="training-with-buttons" key={index}>
                <TrainingTable training={training} />
                <div className="buttons-container">
                  <button
                    className="btn-blue"
                    onClick={() => handleEdit(training.id)}
                  >
                    edit
                  </button>
                  {/* <button
                    className="btn-red"
                    onClick={() => handleDelete(training.id)}
                  >
                    x
                  </button> */}
                </div>
              </div>
            );
          })
          // TO DO: CHECK
          // why does this not work before map?
          .reverse()}
    </div>
  );
};
