import React, { useEffect } from "react";
import { Header } from "./header";
import { Input } from "./input";
import { parse } from "./parser";
import { TrainingTable } from "./training-table";
import { TrainingsTable } from "./trainings-table";
import { Mode, Training, Trainings } from "./types";
import { useLocalStorage } from "./useLocalStorage";
import { SignIn } from "./sign-in";

export const App = () => {
  const [mode, setMode] = useLocalStorage<Mode>("mode", "add");
  const [editId, setEditId] = useLocalStorage<number | null>("editId", null);
  const [id, setId] = useLocalStorage<number>("id", 0);

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

  const handleAdd = (editId: number | null = null) => {
    if (currentTraining.exercises) {
      setTrainings((pastTrainings) => {
        return {
          ...pastTrainings,
          [mode === "edit" ? `${editId}` : id]: currentTraining,
        };
      });

      if (mode === "add") {
        setId((id) => ++id);
      } else if (mode === "edit") {
        setMode("add");
        setEditId(null);
      }

      setCurrentInput("");
    }
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
    setMode("edit");
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
        <SignIn />
        <br />
        <Input
          currentInput={currentInput}
          handleInputChange={handleInputChange}
          handleAdd={handleAdd}
          mode={mode}
          setMode={setMode}
          setCurrentInput={setCurrentInput}
          editId={editId}
          setEditId={setEditId}
        />

        {/* <Login /> */}

        {/* DEBUGG PARSER:  */}
        <div style={{ margin: "40px 0" }}>
          <TrainingTable training={currentTraining} />
        </div>
      </div>

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
