import { Dispatch, useEffect, useMemo, useReducer, useRef } from "react";
import {
  IoCheckmark,
  IoCloseOutline,
  IoPencil,
  IoRepeat,
} from "react-icons/io5";
import "../src/styles/authed-app.css";
import { addTraining } from "./add-training";
import { BottomBar } from "./bottom-bar";
import { useAuth } from "./context";
import { DeletionConfirmation } from "./deletion-confirmation";
import { editTraining } from "./edit-training";
import { fetchTrainings } from "./fetch-trainings";
import { Header } from "./header";
import { Input } from "./input";
import { LoadingSpinner } from "./loading-spinner";
import { parse } from "./parser";
import { serializeTraining } from "./serialize-training";
import { Action, initialState, reducer } from "./state-reducer";
import { MemoizedTrainings } from "./trainings";
import { Mode, Training } from "./types";
import { isEmptyTraining } from "./utils/is-empty-training";

export interface HandleSetEditModeParams {
  id: number | undefined;
  trainings: Training[] | undefined;
  dispatch: Dispatch<Action>;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

interface HandleEditParams {
  mode: Mode;
  currentInput: string;
  dispatch: Dispatch<Action>;
  currentTraining: Training;
  logout: () => void;
}

const handleSetEditMode = ({
  id,
  trainings,
  dispatch,
  textAreaRef,
}: HandleSetEditModeParams) => {
  if (id === undefined) {
    return;
  }

  const training = trainings?.find((training) => training.id === id);

  if (!training) {
    return;
  }

  dispatch({
    type: "set-edit-mode",
    id,
    serializedTraining: serializeTraining(training),
  });

  textAreaRef.current?.focus();
};

const handleEdit = ({
  mode,
  currentInput,
  currentTraining,
  dispatch,
  logout,
}: HandleEditParams) => {
  if (mode.type !== "edit") {
    return;
  }

  const { id, initialInput } = mode;

  // Only edit if training changed
  if (currentInput?.trim() === initialInput) {
    return;
  }

  editTraining({ ...currentTraining, id }, logout);
  dispatch({ type: "edit", currentTraining, mode });
};

const handleCancelEdit = (dispatch: Dispatch<Action>) => {
  dispatch({ type: "cancel-edit" });
};

interface HandleAddParams {
  logout: () => void;
  dispatch: Dispatch<Action>;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  currentTraining: Training;
}

export const handleAdd = ({
  currentTraining,
  logout,
  dispatch,
  textAreaRef,
}: HandleAddParams): void => {
  if (isEmptyTraining(currentTraining)) {
    return;
  }

  addTraining(currentTraining, logout);
  dispatch({ type: "add", currentTraining });
  textAreaRef.current?.blur();
};

const AuthedApp = (): JSX.Element => {
  const [topLevelState, dispatch] = useReducer(reducer, initialState);
  const { trainings, currentInput, inputOpen, mode } = topLevelState;
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const { logout } = useAuth();

  const { headline = null, exercises = [] } =
    useMemo(() => parse(currentInput), [currentInput]) || {};

  const nextTrainingsId =
    trainings && trainings?.length > 0
      ? trainings[trainings.length - 1].id + 1
      : 0;

  const lastTrainingId =
    trainings && trainings.length > 0
      ? trainings[trainings.length - 1].id
      : undefined;

  useEffect(() => {
    (async () =>
      dispatch({ type: "set-trainings", trainings: await fetchTrainings() }))();
  }, []);

  const currentTraining: Training = {
    headline,
    date: new Date().toLocaleDateString(),
    id: nextTrainingsId,
    exercises: exercises,
  };

  return (
    <div className="authed">
      <Header authed />

      {trainings ? (
        <MemoizedTrainings
          dispatch={dispatch}
          trainings={trainings}
          textAreaRef={textAreaRef}
          handleSetEditMode={handleSetEditMode}
        />
      ) : (
        <LoadingSpinner />
      )}

      <BottomBar>
        <Input
          dispatch={dispatch}
          currentInput={currentInput}
          currentTraining={currentTraining}
          textAreaRef={textAreaRef}
          inputOpen={inputOpen}
        />
      </BottomBar>

      <div
        style={{
          height: "125px",
          position: "fixed",
          bottom: inputOpen ? "80px" : "30px",
          right: "20px",
          display: "flex",
          flexDirection: "column",
          transition: " 0.25s ease-in-out",
        }}
      >
        {mode.type === "edit" ? (
          <>
            <button
              className="btn-round top"
              type="button"
              onClick={() =>
                handleEdit({
                  mode,
                  currentInput,
                  currentTraining,
                  dispatch,
                  logout,
                })
              }
            >
              <IoCheckmark size={28} />
            </button>

            <button
              className="btn-round"
              type="button"
              id="cancel"
              onClick={() => handleCancelEdit(dispatch)}
            >
              <IoCloseOutline size={28} />
            </button>
          </>
        ) : (
          <>
            {inputOpen ? (
              <>
                <button
                  className="btn-round top"
                  type="button"
                  disabled={isEmptyTraining(currentTraining) ? true : false}
                  onClick={() =>
                    handleAdd({
                      currentTraining,
                      dispatch,
                      logout,
                      textAreaRef,
                    })
                  }
                >
                  <IoCheckmark
                    stroke={
                      isEmptyTraining(currentTraining)
                        ? "var(--cta-disabled)"
                        : "var(--cta)"
                    }
                    size={28}
                  />
                </button>
                <button
                  className="btn-round"
                  type="button"
                  onClick={() => {
                    dispatch({ type: "cancel-add" });
                  }}
                >
                  <IoCloseOutline stroke="var(--cta)" size={28} />
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn-round top"
                  type="button"
                  onClick={() => {
                    dispatch({ type: "open-input" });
                    textAreaRef.current?.focus();
                  }}
                >
                  <IoPencil stroke="var(--cta)" size={22} />
                </button>
                <button
                  className="btn-round"
                  type="button"
                  disabled={lastTrainingId === undefined ? true : false}
                  onClick={() => {
                    handleSetEditMode({
                      id: lastTrainingId,
                      trainings,
                      dispatch,
                      textAreaRef,
                    });
                  }}
                >
                  <IoRepeat
                    stroke={
                      lastTrainingId === undefined
                        ? "var(--cta-disabled)"
                        : "var(--cta)"
                    }
                    size={28}
                  />
                </button>
              </>
            )}
          </>
        )}
      </div>

      {mode.type === "delete" && (
        <DeletionConfirmation id={mode.id} dispatch={dispatch} />
      )}
    </div>
  );
};

export default AuthedApp;
