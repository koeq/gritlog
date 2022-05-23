import React, { useState } from "react";
import "./app.css";
import { Header } from "./header";
import { Input } from "./input";
import { TrainingTable } from "./training-table";
import { parse } from "./parser";

export interface Training {
  exercise: string | null;
  weight: string | null;
  repetitions: string | null;
}

interface History {
  [k: string]: Training;
}

function App() {
  const [currentTrainingInput, setCurrentTrainingInput] = useState<string>();
  const [history, setHistory] = useState<History>();
  const [id, setId] = useState(0);

  const currentTraining = parse(currentTrainingInput);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentTrainingInput(event.currentTarget.value);
  };

  const handleAdd = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (currentTraining) {
      setHistory((pastHistory) => {
        return {
          ...pastHistory,
          [id]: { ...currentTraining },
        };
      });
      setId((id) => ++id);
      setCurrentTrainingInput("");
    }
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
      <Header />
      <br />
      <Input
        text={currentTrainingInput}
        handleChange={handleChange}
        handleAdd={handleAdd}
      />
      <br></br>
      <br></br>
      <TrainingTable training={currentTraining} />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      {/* TO DO: refactor history into own component */}
      {history &&
        Object.keys(history).map((id) => (
          <TrainingTable key={id} training={history[id]}></TrainingTable>
        ))}
    </div>
  );
}

export default App;
