import { useIsMobile } from "./context/is-mobile-provider";
import { editTraining } from "./edit-training";
import "./styles/input.css";
import { Mode, Training } from "./types";

type HandleCancelEdit = (
  setMode: (
    value:
      | {
          type: "add";
          id: number;
        }
      | {
          type: "edit";
          id: number;
          initialInput: string;
        }
      | {
          type: "delete";
          id: number;
        }
      | ((val: Mode) => Mode)
  ) => void
) => void;

export function Buttons({
  mode,
  handleEdit,
  setMode,
  handleAdd,
  handleCancelEdit,
}: {
  readonly handleAdd: () => void;
  readonly mode: Mode;
  readonly setMode: (value: Mode | ((val: Mode) => Mode)) => void;
  readonly handleEdit: () => void;
  readonly handleCancelEdit: HandleCancelEdit;
}): JSX.Element {
  return (
    <div className="buttons">
      {mode.type === "edit" ? (
        <>
          <button id="save" onClick={handleEdit}>
            save
          </button>

          <button id="cancel" onClick={() => handleCancelEdit(setMode)}>
            cancel
          </button>
        </>
      ) : (
        <button id="add" onClick={handleAdd}>
          add
        </button>
      )}
    </div>
  );
}

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
        ref={textAreaRef}
        onKeyDown={(e) => {
          if (!isMobile && e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAdd();
          }
        }}
      ></textarea>

      <Buttons
        handleAdd={handleAdd}
        handleCancelEdit={handleCancelEdit}
        handleEdit={handleEdit}
        mode={mode}
        setMode={setMode}
      ></Buttons>
    </>
  );
};
