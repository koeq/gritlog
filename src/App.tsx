import React, { useEffect, useState } from "react";
import "./app.css";
import { Header } from "./header";
import { Input } from "./input";
import { TrainingTable } from "./training-table";
import { parse } from "./parser";
import { HistoryTable } from "./history";

export interface Exercise {
  exerciseName: string | null;
  weight: string | null;
  repetitions: string | null;
}

export interface History {
  [k: string]: Exercise[];
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
          [id]: currentTraining,
        };
      });
      setId((id) => ++id);
      setCurrentTrainingInput("");
    }
  };

  const handleEdit = (id: number) => {
    let trainingInput: string = "";

    const training = history[id].map(
      ({ exerciseName, weight, repetitions }) =>
        `${exerciseName ? exerciseName : ""} ${weight ? weight : ""} ${
          repetitions ? repetitions : ""
        }`
    );

    training.forEach((exercise) => {
      trainingInput += `${exercise}\n`;
    });

    setCurrentTrainingInput(trainingInput);
  };

  const handleDelete = (id: number) => {
    setHistory((history) => {
      delete history[id];
      return { ...history };
    });
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

      {history && (
        <HistoryTable
          history={history}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
}

export default App;
