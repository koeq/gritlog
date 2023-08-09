import { IoLogoGithub } from "react-icons/io5";
import "./styles/menu.css";
import { ThemeToggle } from "./theme-toggle";

interface MenuProps {
  readonly menuOpen: boolean;
  readonly logout: () => void;
}

export const Menu = ({ menuOpen, logout }: MenuProps): JSX.Element | null => {
  return (
    <nav className={`menu${menuOpen ? " menu-open" : ""}`}>
      <ul className="menu-list">
        <hr />
        <li className="logout-container">
          <button aria-label="logout" onClick={logout}>
            <span className="menu-list-item-text">logout</span>
          </button>
        </li>
        <hr />
        <li>
          <ThemeToggle />
        </li>
        <hr />
      </ul>
      <div className="social">
        <a href="https://github.com/koeq/gritlog">
          <IoLogoGithub fill="#9EA3A9" size={"26"} />
        </a>
      </div>
    </nav>
  );
};
