import { IoLogoGithub } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { useAuth } from "./context";
import "./styles/menu.css";
import { ThemeToggle } from "./theme-toggle";

interface MenuProps {
  readonly menuOpen: boolean;
  readonly setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setSectionType: React.Dispatch<
    React.SetStateAction<"trainings" | "analytics">
  >;
}

export const Menu = ({
  menuOpen,
  setMenuOpen,
  setSectionType,
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
              setSectionType("trainings");
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
              setSectionType("analytics");
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
