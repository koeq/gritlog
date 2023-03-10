import { useState } from "react";
import {
  IoAdd,
  IoCheckmark,
  IoCloseOutline,
  IoPencil,
  IoRepeat,
} from "react-icons/io5";
import { useIsMobile } from "./context/is-mobile-provider";
import { editTraining } from "./edit-training";
import "./styles/input.css";
import { Mode, Training } from "./types";
import { isEmptyTraining } from "./utils/training-has-content";

interface InputProps {
  readonly handleInputChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  readonly currentInput: string;
  readonly handleAdd: () => void;
  readonly mode: Mode;
  readonly setMode: (value: Mode | ((val: Mode) => Mode)) => void;
  readonly setCurrentInput: React.Dispatch<React.SetStateAction<string>>;
  readonly nextTrainingId: number;
  readonly currentTraining: Training;
  readonly setTrainings: React.Dispatch<
    React.SetStateAction<Training[] | undefined>
  >;
  readonly logout: () => void;
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  readonly lastTrainingId: number | undefined;
  readonly handleSetEditMode: (id: number | undefined) => void;
  readonly inputOpen: boolean;
  readonly setInputOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Input = ({
  handleInputChange,
  currentInput,
  handleAdd,
  mode,
  setMode,
  setCurrentInput,
  nextTrainingId,
  currentTraining,
  setTrainings,
  logout,
  textAreaRef,
  lastTrainingId,
  handleSetEditMode,
  inputOpen,
  setInputOpen,
}: InputProps): JSX.Element => {
  const isMobile = useIsMobile();

  const handleCancelEdit = (
    setMode: (value: Mode | ((val: Mode) => Mode)) => void
  ) => {
    setMode({ type: "add", id: nextTrainingId });
    setCurrentInput("");
  };

  const handleEdit = () => {
    if (mode.type !== "edit") return;

    const { id, initialInput } = mode;

    // only edit if training changed
    if (currentInput?.trim() !== initialInput) {
      editTraining({ ...currentTraining, id }, logout);

      setTrainings((pastTrainings) => {
        return pastTrainings?.map((training) => {
          if (training.id === id) {
            return { ...currentTraining, id };
          }

          return training;
        });
      });
    }

    setCurrentInput("");
    setMode({ type: "add", id: nextTrainingId });
  };

  return (
    <>
      <textarea
        placeholder=" >"
        onChange={handleInputChange}
        value={currentInput}
        name="training"
        id="training"
        className={inputOpen ? "open" : "close"}
        ref={textAreaRef}
        onKeyDown={(e) => {
          if (!isMobile && e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAdd();
          }
        }}
      ></textarea>

      <div className="buttons">
        {mode.type === "edit" ? (
          <>
            <button
              type="button"
              className="button"
              onClick={() => {
                handleEdit();
                setInputOpen(false);
              }}
            >
              <IoCheckmark size={30} />
            </button>

            <button
              type="button"
              id="cancel"
              className="button"
              onClick={() => {
                handleCancelEdit(setMode);
                setInputOpen(false);
              }}
            >
              <IoCloseOutline size={30} />
            </button>
          </>
        ) : (
          <>
            {inputOpen ? (
              <>
                <button
                  type="button"
                  className="button"
                  onClick={() => {
                    handleAdd();
                    !isEmptyTraining(currentTraining) && setInputOpen(false);
                  }}
                >
                  <IoAdd size={28} />
                </button>
                <button
                  type="button"
                  id="cancel"
                  className="button"
                  onClick={() => {
                    setCurrentInput("");
                    setInputOpen(false);
                  }}
                >
                  <IoCloseOutline size={30} />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="button"
                  onClick={() => {
                    setInputOpen(true);
                    textAreaRef.current?.focus();
                  }}
                >
                  <IoPencil size={24} />
                </button>
                <button
                  type="button"
                  id="edit-last"
                  className="button"
                  onClick={() => {
                    handleSetEditMode(lastTrainingId);
                    setInputOpen(true);
                  }}
                >
                  <IoRepeat size={30} />
                </button>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};
