import { BiLogOut } from "react-icons/bi";
import "./styles/logout-button.css";

interface LogoutButtonProps {
  logout: () => void;
}

export const LogoutButton = ({ logout }: LogoutButtonProps): JSX.Element => {
  return (
    <button className="logout-btn" onClick={() => logout()}>
      <BiLogOut className="logout-icon" />
    </button>
  );
};
