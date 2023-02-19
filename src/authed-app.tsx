import { useCallback, useEffect, useRef, useState } from "react";
import "../src/styles/authed-app.css";
import { addTraining } from "./add-training";
import { BottomBar } from "./bottom-bar";
import { useAuth } from "./context/auth-provider";
import { deleteTraining } from "./delete-training";
import { DeletionConfirmation } from "./deletion-confirmation";
import { fetchTrainings } from "./fetch-trainings";
import { Header } from "./header";
import { Input } from "./input";
import { LoadingSpinner } from "./loading-spinner";
import { LogoutButton } from "./logout-button";
import { parse } from "./parser";
import { serializeTraining } from "./serialize-training";
import { MemoizedTrainings } from "./trainings";
import { Training } from "./types";
import {
  parseCurrentInput,
  parseMode,
  useLocalStorage,
} from "./use-local-storage";
import { getLastTrainingId } from "./utils/get-last-training-id";
import { isEmptyTraining } from "./utils/training-has-content";

const AuthedApp = (): JSX.Element => {
  const [trainings, setTrainings] = useState<Training[] | undefined>(undefined);
  const lastTrainingId = getLastTrainingId(trainings);
  const nextTrainingId = lastTrainingId !== undefined ? lastTrainingId + 1 : 0;

  const [mode, setMode] = useLocalStorage(
    "mode",
    {
      type: "add",
      id: nextTrainingId,
    },
    parseMode
  );

  const [currentInput, setCurrentInput] = useLocalStorage(
    "currentInput",
    "",
    parseCurrentInput
  );

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    (async () => setTrainings(await fetchTrainings()))();
  }, []);

  const { headline = null, exercises = [] } = parse(currentInput) || {};

  const currentTraining: Training = {
    headline,
    date: new Date().toLocaleDateString(),
    id: nextTrainingId,
    exercises: exercises,
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentInput(event.currentTarget.value);
  };

  const handleAdd = () => {
    if (isEmptyTraining(currentTraining)) {
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
        id: nextTrainingId,
      });
      return trainings;
    });
  };

  const handleSetEditMode = useCallback(
    (id: number | undefined) => {
      if (id === undefined) {
        return;
      }

      const training = trainings?.find((training) => training.id === id);

      if (!training) {
        return;
      }

      const trainingInput = serializeTraining(training);
      setCurrentInput(trainingInput);
      setMode({ type: "edit", id, initialInput: trainingInput });
      textAreaRef.current?.focus();
    },
    [trainings, setMode, setCurrentInput]
  );

  const handleDelete = (id: number) => {
    deleteTraining(id, logout);

    setTrainings((pastTrainings) => {
      const trainings = pastTrainings?.filter(
        ({ id: pastId }) => pastId !== id
      );

      setMode({
        type: "add",
        id: nextTrainingId,
      });

      return trainings;
    });
  };

  return (
    <div className="authed">
      <Header>{() => <LogoutButton logout={logout} />}</Header>

      {trainings ? (
        <MemoizedTrainings
          setMode={setMode}
          trainings={trainings}
          handleSetEditMode={handleSetEditMode}
        />
      ) : (
        <LoadingSpinner />
      )}

      <BottomBar>
        {() => (
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
            lastTrainingId={lastTrainingId}
            handleSetEditMode={handleSetEditMode}
          />
        )}
      </BottomBar>

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
