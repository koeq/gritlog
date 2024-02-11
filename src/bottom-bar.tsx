import { Dispatch, SetStateAction } from "react";
import { IoMdAdd } from "react-icons/io";
import { IoPencil, IoSearch } from "react-icons/io5";
import { useTopLevelState } from "./context";
import { Hamburger } from "./hamburger";
import "./styles/bottom-bar.css";

interface BottomBarProps {
  readonly menuOpen: boolean;
  readonly handleSetEditMode: (id: number) => void;
  readonly setMenuOpen: Dispatch<SetStateAction<boolean>>;
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

export const BottomBar = ({
  menuOpen,
  textAreaRef,
  setMenuOpen,
  handleSetEditMode,
}: BottomBarProps): JSX.Element => {
  const [{ trainings, showInputSection }, dispatch] = useTopLevelState();
  const latestTrainingId = trainings[0]?.id;

  return (
    <nav id="bottom-bar">
      <Hamburger setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
      <IoSearch size={22} />
      <button
        aria-label="edit"
        className={`btn-round ${trainings && latestTrainingId === undefined ? "btn-disabled" : ""
          }`}
        type="button"
        disabled={
          latestTrainingId === undefined || showInputSection ? true : false
        }
        onClick={
          latestTrainingId !== undefined
            ? () => handleSetEditMode(latestTrainingId)
            : undefined
        }
      >
        <IoPencil size={22} />
      </button>
      <button
        aria-label="add"
        disabled={showInputSection}
        type="button"
        onClick={() => {
          dispatch({ type: "open-input" }),
            dispatch({ type: "set-mode", mode: { type: "add" } }),
            textAreaRef.current?.focus();
        }}
      >
        <IoMdAdd size={26} strokeWidth={10} />
      </button>
    </nav>
  );
};
