import React, { useEffect, useState } from "react";
import { Header } from "./header";
import { Input } from "./input";
import { parse } from "./parser";
import { TrainingTable } from "./training-table";
import { TrainingsTable } from "./trainings-table";
import { Training, Trainings } from "../db-handler/types";
import { Mode } from "./types";
import { getTrainings } from "./get-trainings";
import { useLocalStorage } from "./use-local-storage";
import { addTraining } from "./add-training";
import { deleteTraining } from "./delete-training";
import { createTrainingInput } from "./create-training-input";
import "../src/styles/authed-app.css";
import { SetAuthedContext } from "./app";
import { useSafeContext } from "./utils/use-safe-context";

const AuthedApp = () => {
  const [trainings, setTrainings] = useState<Trainings | undefined>();
  const [editId, setEditId] = useLocalStorage<number | null>("editId", null);
  const [mode, setMode] = useLocalStorage<Mode>("mode", "add");
  const [currentInput, setCurrentInput] = useLocalStorage<string | undefined>(
    "currentInput",
    undefined
  );
  useEffect(() => {
    const fetchOnce = async () => getTrainings(setTrainings);
    fetchOnce();
  }, [setTrainings]);

  const setAuthed = useSafeContext(SetAuthedContext, "SetAuthed");
  const nextTrainingId = trainings ? trainings[trainings.length - 1].id + 1 : 0;

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
      addTraining(currentTraining, setAuthed);
    }
  };

  const handleSetEdit = (id: number) => {
    if (!trainings || !trainings[id]) {
      return;
    }

    const trainingInput = createTrainingInput(trainings[id]);
    setCurrentInput(trainingInput);
    setMode("edit");
    setEditId(id);
  };

  const handleDelete = (id: number) => {
    setTrainings((pastTrainings) =>
      pastTrainings?.filter(({ id: pastId }) => pastId !== id)
    );
    deleteTraining(id, setAuthed);
  };

  return (
    <div className="authed">
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
        currentTraining={currentTraining}
        setTrainings={setTrainings}
        setAuthed={setAuthed}
      />

      <div className="current-training">
        <TrainingTable training={currentTraining} />
      </div>

      {trainings && (
        <TrainingsTable
          trainings={trainings}
          handleEdit={handleSetEdit}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AuthedApp;
