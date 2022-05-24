import React from "react";
import { History } from "./app";
import { TrainingTable } from "./training-table";

interface HistoryTableProps {
  id: number;
  history: History | undefined;
}

export const HistoryTable = ({
  id,
  history,
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
          <TrainingTable key={id} training={history[id]}></TrainingTable>
        ))}
    </div>
  );
};
