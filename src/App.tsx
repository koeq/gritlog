import React, { useEffect, useState } from "react";
import { Header } from "./header";
import { Input } from "./input";
import { parse } from "./parser";
import { TrainingsTable } from "./trainings";
import { Training, Trainings } from "./types";
import { useLocalStorage } from "./useLocalStorage";

// TO DO:
export const App = () => {
  const [id, setId] = useLocalStorage<number>("id", 0);
  const [editId, setEditId] = useState<number | undefined>(undefined);

  const [currentInput, setCurrentInput] = useLocalStorage<string | undefined>(
    "currentInput",
    undefined
  );

  const [trainings, setTrainings] = useLocalStorage<Trainings | undefined>(
    "trainings",
    undefined
  );

  const currentTraining: Training = {
    date: new Date().toLocaleDateString(),
    exercises: parse(currentInput),
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentInput(event.currentTarget.value);
  };

  const handleAdd = (editId: number | undefined = undefined) => {
    if (currentTraining.exercises) {
      setTrainings((pastTrainings) => {
        return {
          ...pastTrainings,
          [editId ? `${editId}` : id]: currentTraining,
        };
      });
      !editId && setId((id) => ++id);
      setCurrentInput("");
    }

    editId && setEditId(undefined);
  };

  const handleEdit = (id: number) => {
    if (!trainings) {
      return;
    }

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

    setCurrentInput(trainingInput.trim());
    setEditId(id);
  };

  const handleDelete = (id: number) => {
    if (!trainings) {
      return;
    }

    setTrainings(() => {
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
          currentInput={currentInput}
          handleInputChange={handleInputChange}
          handleAdd={handleAdd}
          editId={editId}
          setEditId={setEditId}
          setCurrentInput={setCurrentInput}
        />

        {/* 
         DEBUGG PARSER: 
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
};
