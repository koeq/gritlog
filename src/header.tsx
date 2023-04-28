import { useEffect, useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { useAuth } from "./context";
import { Hamburger } from "./hamburger";
import "./styles/header.css";

interface HeaderProps {
  readonly authed: boolean;
}

export const Header = ({ authed }: HeaderProps): JSX.Element => {
  const [menuActive, setMenuActive] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    setMenuActive(false);
  }, [authed]);

  return (
    <>
      <header className={`header ${menuActive ? "header-active" : ""}`}>
        <nav className="header-container">
          <h1 className="heading">gritlog</h1>
          {authed && (
            <Hamburger menuActive={menuActive} setMenuActive={setMenuActive} />
          )}
        </nav>
        <hr />
      </header>
      {authed && <Menu menuActive={menuActive} logout={logout} />}
    </>
  );
};

interface Menu {
  readonly menuActive: boolean;
  readonly logout: () => void;
}

export const Menu = ({ menuActive, logout }: Menu): JSX.Element => {
  return (
    <nav className={`menu ${menuActive ? "menu-active" : ""}`}>
      <ul className="list">
        <li className="logout-container">
          <button onClick={logout}>
            <span className="list-item-text"> Logout</span>
            <BiLogOut size={"26"} className="logout-icon" />
          </button>
        </li>
      </ul>
    </nav>
  );
};
