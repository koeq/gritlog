import { LogoutButton } from "./logout-button";
import "./styles/header.css";

interface HeaderProps {
  logout: () => void;
}

export const Header = ({ logout }: HeaderProps): JSX.Element => {
  return (
    <div className="header">
      <h1 className="heading">backslash</h1>
      <LogoutButton logout={logout} />
    </div>
  );
};
