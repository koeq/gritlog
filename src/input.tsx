import React from "react";

interface InputProps {
  readonly handleInputChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  readonly currentInput: string | undefined;
  readonly handleAdd: (editId: number | undefined) => void;
  readonly editId: number | undefined;
  readonly setEditId: React.Dispatch<React.SetStateAction<number | undefined>>;
  readonly setCurrentInput: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
}

export const Input = ({
  handleInputChange,
  currentInput,
  handleAdd,
  editId,
  setEditId,
  setCurrentInput,
}: InputProps): JSX.Element => {
  const handleStopEdit = (
    setEditId: React.Dispatch<React.SetStateAction<number | undefined>>
  ) => {
    setEditId(undefined);
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
      ></textarea>
      <br />

      <div style={{ display: "flex" }}>
        <input
          type="submit"
          value={editId ? "edit" : "add"}
          onClick={() => handleAdd(editId)}
        />
        {editId && (
          <input
            type="submit"
            value="stop edit"
            onClick={() => handleStopEdit(setEditId)}
          />
        )}
      </div>
    </>
  );
};
