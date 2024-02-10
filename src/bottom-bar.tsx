import { IoMdAdd } from "react-icons/io";
import { IoPencil, IoSearch, IoSettingsOutline } from "react-icons/io5";
import "./styles/bottom-bar.css";

export const BottomBar = (): JSX.Element => {
  return (
    <nav id="bottom-bar">
      <IoSettingsOutline size={19} />
      <IoSearch size={19} />
      <IoPencil size={19} />
      <IoMdAdd color="#fff" size={24} strokeWidth={10} />
    </nav>
  );
};
