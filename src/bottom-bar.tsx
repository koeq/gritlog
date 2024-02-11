import { Dispatch, SetStateAction } from "react";
import { IoMdAdd } from "react-icons/io";
import { IoPencil, IoSearch } from "react-icons/io5";
import { useTopLevelState } from "./context";
import { Hamburger } from "./hamburger";
import "./styles/bottom-bar.css";

interface BottomBarProps {
  readonly menuOpen: boolean;
  readonly setMenuOpen: Dispatch<SetStateAction<boolean>>;
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

export const BottomBar = ({
  menuOpen,
  setMenuOpen,
  textAreaRef,
}: BottomBarProps): JSX.Element => {
  const [_, dispatch] = useTopLevelState();

  return (
    <nav id="bottom-bar">
      <Hamburger setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
      <IoSearch size={22} />
      <IoPencil size={22} />
      <button>
        <IoMdAdd
          onClick={() => {
            dispatch({ type: "open-input" }),
              textAreaRef.current?.focus(),
              setMenuOpen(false);
          }}
          size={26}
          strokeWidth={10}
        />
      </button>
    </nav>
  );
};
