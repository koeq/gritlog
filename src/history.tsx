import React from "react";
import { History } from "./app";
import { TrainingTable } from "./training-table";

interface HistoryTableProps {
  history: History | undefined;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
}

export const HistoryTable = ({
  history,
  handleEdit,
  handleDelete,
}: HistoryTableProps): JSX.Element | null => {
  if (!history) {
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
      {history &&
        Object.keys(history).map((id) => (
          <div style={{ display: "flex", width: "90%" }} key={id}>
            <TrainingTable training={history[id]} />
            <button onClick={() => handleEdit(parseInt(id))}>edit</button>
            <button onClick={() => handleDelete(parseInt(id))}>delete</button>
          </div>
        ))}
    </div>
  );
};
