import React, { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState<string>();

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.currentTarget.value);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>backslash</h1>
      <br />
      <textarea
        onChange={handleChange}
        value={text}
        name="training"
        id="training"
        cols={30}
        rows={10}
      ></textarea>
      <br />
      <input type="submit" />

      <br></br>
      <br></br>

      {text && (
        <div>
          <table style={{ border: "1px solid grey" }}>
            <tr>
              <th style={{ borderBottom: "1px solid grey" }}>
                {new Date().toLocaleDateString()}
              </th>
            </tr>
            <tr>
              <td>{text}</td>
            </tr>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
