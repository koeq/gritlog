import { Dispatch, SetStateAction } from "react";
import { IoMdAdd } from "react-icons/io";
import { IoPencil, IoSearch, IoSettingsOutline } from "react-icons/io5";
import "./styles/bottom-bar.css";

export const BottomBar = ({
  setMenuOpen,
}: {
  readonly setMenuOpen: Dispatch<SetStateAction<boolean>>;
}): JSX.Element => {
  return (
    <nav id="bottom-bar">
      <button onClick={() => setMenuOpen((prev) => !prev)}>
        <IoSettingsOutline id="settings" size={22} />
      </button>
      <IoSearch size={22} />
      <IoPencil size={22} />
      <IoMdAdd size={26} strokeWidth={10} />
    </nav>
  );
};
