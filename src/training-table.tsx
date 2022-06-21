import React from "react";
import "./styles/training-table.css";
import { Training } from "./types";

interface TrainingTableProps {
  readonly training: Training | undefined;
}

export const TrainingTable = ({
  training,
}: TrainingTableProps): JSX.Element | null => {
  if (!training) {
    return null;
  }

  return (
    <table
      style={{
        width: "350px",
        padding: "8px",
        border: "1px solid #FAFAFA",
        borderRadius: "6px",
      }}
    >
      <tbody>
        <tr>
          <th
            colSpan={3}
            style={{
              width: "100px",
              paddingBottom: "10px",
              borderBottom: "1px solid #EAEAEA",
            }}
          >
            {training.date}
          </th>
        </tr>
        <tr>
          <th>exercise</th>
          <th>weight</th>
          <th>repetitions</th>
        </tr>

        {training.exercises &&
          training.exercises.map(
            ({ exerciseName, weight, repetitions }, index) => (
              <tr key={index}>
                <td>{exerciseName}</td>
                <td>{weight}</td>
                <td>{repetitions}</td>
              </tr>
            )
          )}
      </tbody>
    </table>
  );
};
