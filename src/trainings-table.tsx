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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {trainings &&
        trainings
          .map((_, index) => {
            const training = trainings[index];

            return (
              <div
                style={{
                  display: "flex",
                  width: "90%",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
                key={index}
              >
                <TrainingTable training={training} />
                <div
                  style={{
                    display: "flex",
                    marginLeft: "6px",
                  }}
                >
                  <button
                    className="btn-edit"
                    style={{ marginRight: "2px" }}
                    onClick={() => handleEdit(training.id)}
                  >
                    edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(training.id)}
                  >
                    x
                  </button>
                </div>
              </div>
            );
          })
          // TO DO: CHECK
          // why does this not work before we map?
          .reverse()}
    </div>
  );
};
