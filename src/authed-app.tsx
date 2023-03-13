import { useCallback, useEffect, useRef, useState } from "react";
import "../src/styles/authed-app.css";
import { addTraining } from "./add-training";
import { BottomBar } from "./bottom-bar";
import { useAuth } from "./context";
import { deleteTraining } from "./delete-training";
import { DeletionConfirmation } from "./deletion-confirmation";
import { fetchTrainings } from "./fetch-trainings";
import { Header } from "./header";
import { Input } from "./input";
import { LoadingSpinner } from "./loading-spinner";
import { parse } from "./parser";
import { serializeTraining } from "./serialize-training";
import { Trainings } from "./trainings";
import { Mode, Training } from "./types";
import { isEmptyTraining } from "./utils/training-has-content";

const AuthedApp = (): JSX.Element => {
  const [trainings, setTrainings] = useState<Training[] | undefined>(undefined);
  const lastTrainingId = trainings && trainings[trainings.length - 1].id;
  const nextTrainingId = lastTrainingId === undefined ? 0 : lastTrainingId + 1;
  const [currentInput, setCurrentInput] = useState("");
  const [inputOpen, setInputOpen] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const { logout } = useAuth();
  const { headline = null, exercises = [] } = parse(currentInput) || {};

  const [mode, setMode] = useState<Mode>({
    type: "add",
    id: nextTrainingId,
  });

  useEffect(() => {
    (async () => setTrainings(await fetchTrainings()))();
  }, []);

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
    setInputOpen(false);
    textAreaRef.current?.blur();
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
      setInputOpen(true);
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

      setInputOpen(false);

      if (currentInput) {
        setCurrentInput("");
      }

      return trainings;
    });
  };

  return (
    <div className="authed">
      <Header authed />

      {trainings ? (
        <Trainings
          setMode={setMode}
          trainings={trainings}
          handleSetEditMode={handleSetEditMode}
        />
      ) : (
        <LoadingSpinner />
      )}

      <BottomBar>
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
          textAreaRef={textAreaRef}
          lastTrainingId={lastTrainingId}
          handleSetEditMode={handleSetEditMode}
          inputOpen={inputOpen}
          setInputOpen={setInputOpen}
        />
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
