import React, { useEffect, useState } from "react";
import "./app.css";
import { Header } from "./header";
import { Input } from "./input";
import { parse } from "./parser";
import { TrainingsTable } from "./trainings";

export interface Exercise {
  readonly exerciseName: string | null;
  readonly weight: string | null;
  readonly repetitions: string | null;
}

export interface Training {
  readonly date: string;
  readonly exercises: Exercise[] | undefined;
}

export interface Trainings {
  [id: string]: Training;
}

function App() {
  const [currentTrainingInput, setCurrentTrainingInput] = useState<string>();
  const [editId, setEditId] = useState<number | undefined>(undefined);
  const savedTrainings = localStorage.getItem("history");

  const [trainings, setTrainings] = useState<Trainings>(
    savedTrainings ? JSON.parse(savedTrainings) : undefined
  );

  const savedId = localStorage.getItem("id");
  const [id, setId] = useState(savedId ? parseInt(savedId) : 0);
  const currentTraining: Training = {
    date: new Date().toLocaleDateString(),
    exercises: parse(currentTrainingInput),
  };

  // sync id and history with local storage
  useEffect(() => {
    localStorage.setItem("id", `${id}`);

    if (trainings) {
      localStorage.setItem("history", JSON.stringify(trainings));
    }
  }, [id, trainings]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentTrainingInput(event.currentTarget.value);
  };

  // jump out of edit mode if currentTrainingInput gets deleted
  useEffect(() => {}, [currentTrainingInput]);

  const handleAdd = (editId: number | undefined = undefined) => {
    if (currentTraining) {
      setTrainings((pastTrainings) => {
        return {
          ...pastTrainings,
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

    const exercises = trainings[id].exercises;
    const exercisesInput = exercises
      ? exercises.map(
          ({ exerciseName, weight, repetitions }) =>
            `${exerciseName ? exerciseName : ""} ${weight ? weight : ""} ${
              repetitions ? repetitions : ""
            }`
        )
      : [];

    exercisesInput.forEach((exercise) => {
      trainingInput += `${exercise}\n`;
    });

    setCurrentTrainingInput(trainingInput);
    setEditId(id);
  };

  const handleDelete = (id: number) => {
    setTrainings((history) => {
      delete trainings[id];
      return { ...trainings };
    });
  };

  return (
    <>
      <div
        style={{
          width: "100%",
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
        {/* <br></br>
        <br></br>
         DEBUGG PARSER 
        <TrainingTable training={currentTraining} /> */}
      </div>
      <br />
      <br />
      <br />
      {trainings && (
        <TrainingsTable
          trainings={trainings}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
}

export default App;
