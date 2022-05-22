import React from "react";
import "./table.css";
import { parser } from "./parser";

interface TableProps {
  text: string | undefined;
}

export const Table = ({ text }: TableProps): JSX.Element | null => {
  if (!text) {
    return null;
  }
  const { exercise, weight, repetitions } = parser(text);

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
