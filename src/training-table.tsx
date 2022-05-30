import React from "react";
import { Exercise } from "./app";
import "./table.css";

interface TableProps {
  training: Exercise[] | undefined;
}

export const TrainingTable = ({ training }: TableProps): JSX.Element | null => {
  if (!training) {
    return null;
  }

  return (
    <table style={{ width: "350px", border: "1px solid grey" }}>
      <tbody>
        <tr>
          <th style={{ paddingBottom: "10px" }}>
            {new Date().toLocaleDateString()}
          </th>
        </tr>
        <tr>
          <th>exercise</th>
          <th>weight</th>
          <th>repetitions</th>
        </tr>

        {training.map(({ exerciseName, weight, repetitions }, index) => (
          <tr key={index}>
            <td>{exerciseName}</td>
            <td>{weight}</td>
            <td>{repetitions}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
