import React from "react";
import { History } from "./app";
import { TrainingTable } from "./training-table";

interface HistoryTableProps {
  history: History | undefined;
  handleDelete: (id: number) => void;
}

export const HistoryTable = ({
  history,
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
          <div style={{ display: "flex" }} key={id}>
            <TrainingTable training={history[id]} />
            {/* TO DO: add edit button & functionality */}
            <button onClick={() => handleDelete(parseInt(id))}>delete</button>
          </div>
        ))}
    </div>
  );
};
