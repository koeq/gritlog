import { BiLogOut } from "react-icons/bi";
import { useAuth } from "./context";
import "./styles/logout-button.css";

export const LogoutButton = (): JSX.Element => {
  const { logout } = useAuth();

  return (
    <button className="logout-btn" onClick={() => logout()}>
      <BiLogOut className="logout-icon" color="#fff" />
    </button>
  );
};
