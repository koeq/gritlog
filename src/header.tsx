import { BsFillLightningChargeFill } from "react-icons/bs";
import { LogoutButton } from "./logout-button";
import "./styles/header.css";

interface HeaderProps {
  readonly authed: boolean;
}

export const Header = ({ authed }: HeaderProps): JSX.Element => {
  return (
    <nav className="header">
      <div className="header-container">
        <h1 className="heading">
          gritlog <BsFillLightningChargeFill size="20" />
        </h1>
        {authed && <LogoutButton />}
      </div>
      <hr />
    </nav>
  );
};
