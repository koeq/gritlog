import { useEffect, useRef, useState } from "react";
import { Training } from "../lambdas/db-handler/types";
import "../src/styles/authed-app.css";
import { addTraining } from "./add-training";
import { useAuth } from "./context/auth-provider";
import { CurrentTraining } from "./current-training";
import { deleteTraining } from "./delete-training";
import { DeletionConfirmation } from "./deletion-confirmation";
import { getTrainings } from "./get-trainings";
import { Header } from "./header";
import { Input } from "./input";
import { LoadingSpinner } from "./loading-spinner";
import { LogoutButton } from "./logout-button";
import { parse } from "./parser";
import { serializeTraining } from "./serialize-training";
import { Trainings } from "./trainings";
import { Mode } from "./types";
import { useLocalStorage } from "./use-local-storage";
import { getNextTrainingId } from "./utils/use-next-training-id";

const AuthedApp = (): JSX.Element => {
  const [trainings, setTrainings] = useState<Training[] | undefined>(undefined);
  const nextTrainingId = getNextTrainingId(trainings);

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

  const { headline = null, exercises } = parse(currentInput) || {};

  const currentTraining: Training = {
    headline,
    date: new Date().toLocaleDateString(),
    id: getNextTrainingId(trainings),
    exercises: exercises,
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentInput(event.currentTarget.value);
  };

  const handleAdd = () => {
    if (!currentTraining.exercises) {
      return;
    }

    addTraining(currentTraining, logout);
    setCurrentInput("");

    setTrainings((pastTrainings) => {
      const trainings = pastTrainings
        ? [...pastTrainings, currentTraining]
        : [currentTraining];

      setMode({
        type: "add",
        id: getNextTrainingId(trainings),
      });
      return trainings;
    });
  };

  const handleSetEditMode = (id: number) => {
    const training = trainings?.find((training) => training.id === id);

    if (!training) {
      return;
    }

    const trainingInput = serializeTraining(training);
    setCurrentInput(trainingInput);
    setMode({ type: "edit", id, initialInput: trainingInput });
    textAreaRef.current?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number) => {
    deleteTraining(id, logout);

    setTrainings((pastTrainings) => {
      const trainings = pastTrainings?.filter(
        ({ id: pastId }) => pastId !== id
      );

      setMode({
        type: "add",
        id: getNextTrainingId(trainings),
      });

      return trainings;
    });
  };

  return (
    <div className="authed">
      <Header>{() => <LogoutButton logout={logout} />}</Header>

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
