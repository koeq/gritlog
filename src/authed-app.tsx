import React, { useEffect, useRef, useState } from "react";
import { Header } from "./header";
import { Input } from "./input";
import { parse } from "./parser";
import { Trainings } from "./trainings";
import { Training } from "../db-handler/types";
import { getTrainings } from "./get-trainings";
import { useLocalStorage } from "./use-local-storage";
import { addTraining } from "./add-training";
import { deleteTraining } from "./delete-training";
import { createTrainingInput } from "./create-training-input";
import { useAuth } from "./context/auth-provider";
import { LoadingSpinner } from "./loading-spinner";
import { DeletionConfirmation } from "./deletion-confirmation";
import { CurrentTraining } from "./current-training";
import { Mode } from "./types";
import "../src/styles/authed-app.css";

const AuthedApp = () => {
  const [trainings, setTrainings] = useState<Training[] | []>([]);

  const nextTrainingId =
    trainings.length > 0 ? trainings[trainings.length - 1].id + 1 : 0;

  const [mode, setMode] = useLocalStorage<Mode>("mode", {
    type: "add",
    id: nextTrainingId,
  });

  const [currentInput, setCurrentInput] = useLocalStorage<string | undefined>(
    "currentInput",
    undefined
  );

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchOnce = async () => getTrainings(setTrainings);
    fetchOnce();
  }, [setTrainings]);

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
      addTraining(currentTraining, logout);

      setTrainings((pastTrainings) => {
        return pastTrainings
          ? [...pastTrainings, currentTraining]
          : [currentTraining];
      });

      setCurrentInput("");

      setMode((prev) => {
        return { ...prev, id: nextTrainingId };
      });
    }
  };

  const handleSetEditMode = (id: number) => {
    const training = trainings.find((training) => training.id === id);

    if (!training) {
      return;
    }

    const trainingInput = createTrainingInput(training);
    setCurrentInput(trainingInput);
    setMode({ type: "edit", id });
    textAreaRef.current?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number) => {
    setTrainings((pastTrainings) =>
      pastTrainings?.filter(({ id: pastId }) => pastId !== id)
    );
    deleteTraining(id, logout);
  };

  // TO DO: bring mode.id and nextTrainingsId into sync
  // console.log(
  //   `mode: ${JSON.stringify(mode)},  nextTrainingsId: ${nextTrainingId}`
  // );

  return (
    <div className="authed">
      <Header />

      <Input
        currentInput={currentInput}
        handleInputChange={handleInputChange}
        handleAdd={handleAdd}
        mode={mode}
        setMode={setMode}
        nextTrainingId={nextTrainingId}
        setCurrentInput={setCurrentInput}
        currentTraining={currentTraining}
        setTrainings={setTrainings}
        logout={logout}
        textAreaRef={textAreaRef}
      />

      <CurrentTraining currentTraining={currentTraining} />

      {trainings ? (
        <Trainings
          setMode={setMode}
          trainings={trainings}
          handleSetEditMode={handleSetEditMode}
        />
      ) : (
        <LoadingSpinner />
      )}

      {mode.type === "delete" && (
        <DeletionConfirmation
          id={mode.id}
          setMode={setMode}
          nextTrainingId={nextTrainingId}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AuthedApp;
