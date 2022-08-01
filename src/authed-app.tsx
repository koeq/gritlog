import React, { useState } from "react";
import { Header } from "./header";
import { Input } from "./input";
import { parse } from "./parser";
import { TrainingTable } from "./training-table";
import { TrainingsTable } from "./trainings-table";
import { Training, Trainings } from "../db-handler/types";
import { Mode } from "./types";
import { getAllTrainings } from "./get-all-trainings";
import { useLocalStorage } from "./use-local-storage";
import { fetchOnce } from "./utils";
import { addTraining } from "./add-training";

const AuthedApp = () => {
  fetchOnce(() => getAllTrainings(setTrainings, setNextTrainingId));
  const [trainings, setTrainings] = useState<Trainings | undefined>();
  const [nextTrainingId, setNextTrainingId] = useState<number>(0);

  const [mode, setMode] = useLocalStorage<Mode>("mode", "add");
  const [editId, setEditId] = useLocalStorage<number | null>("editId", null);

  const [currentInput, setCurrentInput] = useLocalStorage<string | undefined>(
    "currentInput",
    undefined
  );

  const currentTraining: Training = {
    date: new Date().toLocaleDateString(),
    id: nextTrainingId,
    exercises: parse(currentInput),
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentInput(event.currentTarget.value);
  };

  const handleAdd = () => {
    if (currentTraining.exercises) {
      setTrainings((pastTrainings) => {
        return pastTrainings
          ? [...pastTrainings, currentTraining]
          : [currentTraining];
      });
      setCurrentInput("");
      addTraining(currentTraining);
      setNextTrainingId((currentId) => ++currentId);
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
    setTrainings((pastTrainings) =>
      pastTrainings?.filter(({ id: pastId }) => pastId !== id)
    );
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
          mode={mode}
          setMode={setMode}
          setCurrentInput={setCurrentInput}
          editId={editId}
          setEditId={setEditId}
        />

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

export default AuthedApp;
