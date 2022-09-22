import React from "react";
import { Training, Trainings } from "../db-handler/types";
import { editTraining } from "./edit-training";
import { Mode } from "./types";
import "./styles/input.css";

interface InputProps {
  readonly handleInputChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  readonly currentInput: string | undefined;
  readonly handleAdd: () => void;
  readonly mode: Mode;
  readonly setMode: React.Dispatch<React.SetStateAction<Mode>>;
  readonly setCurrentInput: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  readonly editId: number | null;
  readonly setEditId: React.Dispatch<React.SetStateAction<number | null>>;
  readonly currentTraining: Training;
  readonly setTrainings: React.Dispatch<
    React.SetStateAction<Trainings | undefined>
  >;
  readonly setAuthed: React.Dispatch<React.SetStateAction<boolean>>;
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
  setAuthed,
}: InputProps) => {
  const handleStopEdit = (
    setMode: React.Dispatch<React.SetStateAction<Mode>>,
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

    editTraining({ ...currentTraining, id: editId }, setAuthed);
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
          <button className={"btn-blue"} onClick={() => handleEdit()}>
            edit
          </button>
        )}
        {mode === "edit" && (
          <button
            className="btn-red"
            onClick={() => handleStopEdit(setMode, setEditId)}
          >
            stop edit
          </button>
        )}
      </div>
    </>
  );
};
