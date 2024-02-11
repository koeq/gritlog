import { IoMdAdd } from "react-icons/io";
import { IoPencil, IoSearch, IoSettingsOutline } from "react-icons/io5";
import "./styles/bottom-bar.css";

export const BottomBar = (): JSX.Element => {
  return (
    <nav id="bottom-bar">
      <IoSettingsOutline size={22} />
      <IoSearch size={22} />
      <IoPencil size={22} />
      <IoMdAdd color="#fff" size={26} strokeWidth={10} />
    </nav>
  );
};
