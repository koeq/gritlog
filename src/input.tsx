import React from "react";
import { Training, Trainings } from "../db-handler/types";
import { editTraining } from "./edit-training";
import { Mode } from "./types";

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
    if (!editId) {
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

    editTraining(editId, currentTraining);
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
        cols={30}
        rows={10}
        style={{
          width: "min(400px, 80%)",
          border: "1px solid rgba(0, 0, 0, 0.2)",
          borderRadius: "4px",
        }}
      ></textarea>
      <br />

      <div style={{ display: "flex" }}>
        {mode === "add" && (
          <button
            style={{ width: "250px" }}
            className={"btn-green"}
            onClick={() => handleAdd()}
          >
            add
          </button>
        )}

        {mode === "edit" && editId && (
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
