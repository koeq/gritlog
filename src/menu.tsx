import { IoLogoGithub } from "react-icons/io5";

interface MenuProps {
  readonly menuActive: boolean;
  readonly logout: () => void;
}

export const Menu = ({ menuActive, logout }: MenuProps): JSX.Element => {
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
