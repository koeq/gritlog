import { IoLogoGithub } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { Section } from "./app";
import { useAuth } from "./context";
import "./styles/menu.css";
import { ThemeToggle } from "./theme-toggle";

interface MenuProps {
  readonly menuOpen: boolean;
  readonly setSection: React.Dispatch<React.SetStateAction<Section>>;
  readonly setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Menu = ({
  menuOpen,
  setSection,
  setMenuOpen,
}: MenuProps): JSX.Element | null => {
  const { logout } = useAuth();

  return (
    <nav className={`menu${menuOpen ? " menu-open" : ""}`}>
      <ul className="menu-list">
        <hr />
        <li>
          <a
            className="menu-list-item"
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              setSection({ type: "trainings" });
            }}
          >
            trainings
          </a>
        </li>
        <hr />
        <li>
          <a
            className="menu-list-item"
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              setSection({ type: "analytics", analyticsType: "activity" });
            }}
          >
            analytics
          </a>
        </li>
        <hr />
        <li id="menu-list-item-btns">
          <ThemeToggle />
          <button
            onClick={logout}
            aria-label="logout"
            className="menu-list-item"
          >
            <div id="menu-logout">
              <MdLogout size={23} />
            </div>
          </button>
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
