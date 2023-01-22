import { useCallback, useEffect, useRef, useState } from "react";
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
import { MemoizedTrainings } from "./trainings";
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
  }, []);

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

  const handleSetEditMode = useCallback(
    (id: number) => {
      const training = trainings?.find((training) => training.id === id);

      if (!training) {
        return;
      }

      const trainingInput = serializeTraining(training);
      setCurrentInput(trainingInput);
      setMode({ type: "edit", id, initialInput: trainingInput });
      textAreaRef.current?.focus();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    // This is needed so Trainings can be memoized. If we pass setCurrentInput to the dependecies array
    // handleSetEditMode will have a different identity on every render, which will make the MemoizedTrainings also rerender.
    // The reason for this is that the setter function the useLocalStorage hook returns is getting a new identity if the internal state changes.
    // This is needed only when the state setter needs to create the new state based on the old one (when a function is being passed).
    //  Since this is not the case for setCurrentInput it should be safe to omit it from the dependecies array below.
    // This is hacky and should be solved with a better design.

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trainings, setMode]
  );

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
        <MemoizedTrainings
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
