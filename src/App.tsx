import React, { useEffect, useState } from "react";
import "./app.css";
import { Header } from "./header";
import { Input } from "./input";
import { TrainingTable } from "./training-table";
import { parse } from "./parser";
import { HistoryTable } from "./history-table";

export interface Training {
  exercise: string | null;
  weight: string | null;
  repetitions: string | null;
}

export interface History {
  [k: string]: Training;
}

function App() {
  const [currentTrainingInput, setCurrentTrainingInput] = useState<string>();
  const savedHistory = localStorage.getItem("history");

  const [history, setHistory] = useState<History>(
    savedHistory ? JSON.parse(savedHistory) : undefined
  );

  const savedId = localStorage.getItem("id");
  const [id, setId] = useState(savedId ? parseInt(savedId) : 0);
  const currentTraining = parse(currentTrainingInput);

  useEffect(() => {
    localStorage.setItem("id", `${id}`);

    if (history) {
      localStorage.setItem("history", JSON.stringify(history));
    }
  }, [id, history]);

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
    <>
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
      </div>

      <HistoryTable id={id} history={history} />
    </>
  );
}

export default App;
