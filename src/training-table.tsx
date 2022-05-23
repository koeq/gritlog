import React from "react";
import { Training } from "./app";
import "./table.css";

interface TableProps {
  training: Training | undefined;
}

export const TrainingTable = ({ training }: TableProps): JSX.Element | null => {
  if (!training) {
    return null;
  }

  const { exercise, weight, repetitions } = training;

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
        <tr>
          <td>{exercise}</td>
          <td>{weight}</td>
          <td>{repetitions}</td>
        </tr>
      </tbody>
    </table>
  );
};
