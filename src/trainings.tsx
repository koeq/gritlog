import React from "react";
import { TrainingTable } from "./training-table";
import { Trainings } from "./types";

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
        Object.keys(trainings).map((id) => (
          <div
            style={{ display: "flex", width: "90%", justifyContent: "center" }}
            key={id}
          >
            <TrainingTable training={trainings[id]} />
            <button onClick={() => handleEdit(parseInt(id))}>edit</button>
            <button onClick={() => handleDelete(parseInt(id))}>delete</button>
          </div>
        ))}
    </div>
  );
};
