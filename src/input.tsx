import React from "react";

interface InputProps {
  readonly handleChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  readonly text: string | undefined;
  readonly handleAdd: (editId: number | undefined) => void;
  readonly editId: number | undefined;
  readonly setEditId: React.Dispatch<React.SetStateAction<number | undefined>>;
  readonly setCurrentTrainingInput: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
}

export const Input = ({
  handleChange,
  text,
  handleAdd,
  editId,
  setEditId,
  setCurrentTrainingInput,
}: InputProps): JSX.Element => {
  const handleStopEdit = (
    setEditId: React.Dispatch<React.SetStateAction<number | undefined>>
  ) => {
    setEditId(undefined);
    setCurrentTrainingInput("");
  };

  return (
    <>
      <textarea
        onChange={handleChange}
        value={text}
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
