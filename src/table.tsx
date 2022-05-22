import React from "react";

interface TableProps {
  text: string | undefined;
}

export const Table = ({ text }: TableProps): JSX.Element | null => {
  if (!text) {
    return null;
  }

  return (
    <table style={{ border: "1px solid grey" }}>
      <tbody>
        <tr>
          <th style={{ borderBottom: "1px solid grey" }}>
            {new Date().toLocaleDateString()}
          </th>
        </tr>
        <tr>
          <td>{text}</td>
        </tr>
      </tbody>
    </table>
  );
};
