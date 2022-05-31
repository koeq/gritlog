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
  const [editId, setEditId] = useState<number | undefined>(undefined);
  const savedHistory = localStorage.getItem("history");

  const [history, setHistory] = useState<History>(
    savedHistory ? JSON.parse(savedHistory) : undefined
  );

  const savedId = localStorage.getItem("id");
  const [id, setId] = useState(savedId ? parseInt(savedId) : 0);
  const currentTraining = parse(currentTrainingInput);

  // sync id and history with local storage
  useEffect(() => {
    localStorage.setItem("id", `${id}`);

    if (history) {
      localStorage.setItem("history", JSON.stringify(history));
    }
  }, [id, history]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentTrainingInput(event.currentTarget.value);
  };

  // jump out of edit mode if currentTrainingInput gets deleted
  useEffect(() => {}, [currentTrainingInput]);

  const handleAdd = (editId: number | undefined = undefined) => {
    if (currentTraining) {
      setHistory((pastHistory) => {
        return {
          ...pastHistory,
          [editId ? `${editId}` : id]: currentTraining,
        };
      });
      !editId && setId((id) => ++id);
      setCurrentTrainingInput("");
    }

    editId && setEditId(undefined);
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
    setEditId(id);
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
          editId={editId}
          setEditId={setEditId}
          setCurrentTrainingInput={setCurrentTrainingInput}
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
