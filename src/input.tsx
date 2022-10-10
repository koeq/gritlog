import React from "react";
import { Training } from "../db-handler/types";
import { editTraining } from "./edit-training";
import { InputMode } from "./types";
import { useIsMobile } from "./utils/use-is-mobile";
import "./styles/input.css";

interface InputProps {
  readonly handleInputChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  readonly currentInput: string | undefined;
  readonly handleAdd: () => void;
  readonly mode: InputMode;
  readonly setMode: React.Dispatch<React.SetStateAction<InputMode>>;
  readonly setCurrentInput: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  readonly editId: number | null;
  readonly setEditId: React.Dispatch<React.SetStateAction<number | null>>;
  readonly currentTraining: Training;
  readonly setTrainings: React.Dispatch<
    React.SetStateAction<Training[] | undefined>
  >;
  readonly logout: () => void;
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

export const Input = ({
  handleInputChange,
  currentInput,
  handleAdd,
  mode,
  setMode,
  setCurrentInput,
  editId,
  setEditId,
  currentTraining,
  setTrainings,
  logout,
  textAreaRef,
}: InputProps) => {
  const isMobile = useIsMobile();

  const handleStopEdit = (
    setMode: React.Dispatch<React.SetStateAction<InputMode>>,
    setEditId: React.Dispatch<React.SetStateAction<number | null>>
  ) => {
    setMode("add");
    setEditId(null);
    setCurrentInput("");
  };

  const handleEdit = () => {
    if (!editId && editId !== 0) {
      return;
    }

    setTrainings((pastTrainings) => {
      if (!pastTrainings) {
        return;
      }

      const trainings = pastTrainings.slice();
      trainings[editId] = { ...currentTraining, id: editId };
      return trainings;
    });

    editTraining({ ...currentTraining, id: editId }, logout);
    setCurrentInput("");
    setMode("add");
    setEditId(null);
  };

  return (
    <>
      <textarea
        onChange={handleInputChange}
        value={currentInput}
        name="training"
        id="training"
        ref={textAreaRef}
        onKeyDown={(e) => {
          if (!isMobile && e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAdd();
          }
        }}
      ></textarea>

      <div className="buttons">
        {mode === "add" && (
          <button
            className={"btn-green add-button"}
            onClick={() => handleAdd()}
          >
            add
          </button>
        )}

        {mode === "edit" && (
          <button className={"btn-blue btn-left"} onClick={() => handleEdit()}>
            save
          </button>
        )}
        {mode === "edit" && (
          <button
            className={"btn-red btn-right"}
            onClick={() => handleStopEdit(setMode, setEditId)}
          >
            cancel
          </button>
        )}
      </div>
    </>
  );
};
