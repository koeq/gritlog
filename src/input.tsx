import React from "react";
import { Mode } from "./types";

interface InputProps {
  readonly handleInputChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  readonly currentInput: string | undefined;
  readonly handleAdd: (editId: number | null) => void;
  readonly mode: Mode;
  readonly setMode: React.Dispatch<React.SetStateAction<Mode>>;
  readonly setCurrentInput: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  readonly editId: number | null;
  readonly setEditId: React.Dispatch<React.SetStateAction<number | null>>;
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
}: InputProps): JSX.Element => {
  const handleStopEdit = (
    setMode: React.Dispatch<React.SetStateAction<Mode>>,
    setEditId: React.Dispatch<React.SetStateAction<number | null>>
  ) => {
    setMode("add");
    setEditId(null);
    setCurrentInput("");
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
        <button
          style={mode === "add" ? { width: "250px" } : {}}
          className={mode === "add" ? "btn-add" : "btn-edit"}
          onClick={() => handleAdd(editId)}
        >
          {mode}
        </button>
        {mode === "edit" && (
          <button
            className="btn-delete"
            onClick={() => handleStopEdit(setMode, setEditId)}
          >
            stop edit
          </button>
        )}
      </div>
    </>
  );
};
