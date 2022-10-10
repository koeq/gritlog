import React, { useEffect, useRef, useState } from "react";
import { Header } from "./header";
import { Input } from "./input";
import { parse } from "./parser";
import { TrainingTable } from "./training-table";
import { Trainings } from "./trainings";
import { Training } from "../db-handler/types";
import { InputMode } from "./types";
import { getTrainings } from "./get-trainings";
import { useLocalStorage } from "./use-local-storage";
import { addTraining } from "./add-training";
import { deleteTraining } from "./delete-training";
import { createTrainingInput } from "./create-training-input";
import "../src/styles/authed-app.css";
import { useAuth } from "./context/auth-provider";
import { LoadingSpinner } from "./loading-spinner";

const AuthedApp = () => {
  const [trainings, setTrainings] = useState<Training[] | undefined>();
  const [editId, setEditId] = useLocalStorage<number | null>("editId", null);
  const [inputMode, setInputMode] = useLocalStorage<InputMode>(
    "inputMode",
    "add"
  );
  const [currentInput, setCurrentInput] = useLocalStorage<string | undefined>(
    "currentInput",
    undefined
  );

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const fetchOnce = async () => getTrainings(setTrainings);
    fetchOnce();
  }, [setTrainings]);

  const { logout } = useAuth();
  const nextTrainingId =
    trainings && trainings.length > 0
      ? trainings[trainings.length - 1].id + 1
      : 0;

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
      addTraining(currentTraining, logout);
    }
  };

  const handleSetEdit = (id: number) => {
    const training = trainings?.find((training) => training.id === id);
    if (!training) {
      return;
    }

    const trainingInput = createTrainingInput(training);
    setCurrentInput(trainingInput);
    setInputMode("edit");
    setEditId(id);
    textAreaRef.current?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number) => {
    setTrainings((pastTrainings) =>
      pastTrainings?.filter(({ id: pastId }) => pastId !== id)
    );
    deleteTraining(id, logout);
  };

  return (
    <div className="authed">
      <Header />

      <Input
        currentInput={currentInput}
        handleInputChange={handleInputChange}
        handleAdd={handleAdd}
        mode={inputMode}
        setMode={setInputMode}
        setCurrentInput={setCurrentInput}
        editId={editId}
        setEditId={setEditId}
        currentTraining={currentTraining}
        setTrainings={setTrainings}
        logout={logout}
        textAreaRef={textAreaRef}
      />

      <div className="current-training">
        <TrainingTable training={currentTraining} />
      </div>

      {trainings ? (
        <Trainings
          trainings={trainings}
          handleEdit={handleSetEdit}
          handleDelete={handleDelete}
        />
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default AuthedApp;
