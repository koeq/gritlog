import React from "react";

interface InputProps {
  handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  text: string | undefined;
  handleAdd: (event: React.FormEvent<HTMLInputElement>) => void;
}

export const Input = ({
  handleChange,
  text,
  handleAdd,
}: InputProps): JSX.Element => {
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
      <input type="submit" value="add" onClick={handleAdd} />
    </>
  );
};
