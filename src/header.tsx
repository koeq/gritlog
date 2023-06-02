import { useEffect, useState } from "react";
import { IoLogoGithub } from "react-icons/io5";
import { useAuth } from "./context";
import { useTheme } from "./context/theme-provider";
import { Hamburger } from "./hamburger";
import "./styles/header.css";
import { ThemeToggle } from "./theme-toggle";

interface HeaderProps {
  readonly authed: boolean;
}

export const Header = ({ authed }: HeaderProps): JSX.Element => {
  const [menuActive, setMenuActive] = useState(false);
  const [theme, setTheme] = useTheme();
  const { logout } = useAuth();

  const toggleTheme = () => {
    setTheme((theme) => (theme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    setMenuActive(false);
  }, [authed]);

  return (
    <>
      <header className={`header ${menuActive ? "header-active" : ""}`}>
        <nav className="header-container">
          <h1 className="heading">gritlog</h1>
          <div className="cta-section">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            {authed && (
              <Hamburger
                menuActive={menuActive}
                setMenuActive={setMenuActive}
              />
            )}
          </div>
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
      <ul className="menu-list">
        <hr />
        <li className="logout-container">
          <button aria-label="logout" onClick={logout}>
            <span className="menu-list-item-text">logout</span>
          </button>
        </li>
        <hr />
        <li>
          <a href="https://github.com/koeq/gritlog">
            <span className="menu-list-item-text">github</span>
          </a>
        </li>
        <hr />
      </ul>
      <div className="social">
        <a href="https://github.com/koeq">
          <IoLogoGithub fill="#9EA3A9" size={"26"} />
        </a>
      </div>
    </nav>
  );
};
