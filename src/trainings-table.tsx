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
        Object.keys(trainings)
          .reverse()
          .map((id) => (
            <div
              style={{
                display: "flex",
                width: "90%",
                justifyContent: "center",
                marginBottom: "16px",
              }}
              key={id}
            >
              <TrainingTable training={trainings[parseInt(id)]} />
              <div
                style={{
                  display: "flex",
                  marginLeft: "6px",
                }}
              >
                <button
                  className="btn-edit"
                  style={{ marginRight: "2px" }}
                  onClick={() => handleEdit(parseInt(id))}
                >
                  edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(parseInt(id))}
                >
                  x
                </button>
              </div>
            </div>
          ))}
    </div>
  );
};
