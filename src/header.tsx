import { useEffect } from "react";
import { Hamburger } from "./hamburger";
import { SearchBox } from "./search-box";
import "./styles/header.css";

interface HeaderProps {
  readonly authed: boolean;
  readonly menuOpen: boolean;
  readonly contentType: "trainings" | "statistics";
  readonly setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header = ({
  authed,
  menuOpen,
  contentType,
  setMenuOpen,
}: HeaderProps): JSX.Element => {
  useEffect(() => {
    setMenuOpen(false);
  }, [setMenuOpen, authed]);

  return (
    <header className={`header${menuOpen ? " opaque" : ""}`}>
      <div className="header-container">
        <h1 className="heading">gritlog</h1>
        {authed && (
          <div className="cta-section">
            {contentType === "trainings" && <SearchBox />}
            <Hamburger menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          </div>
        )}
      </div>
      <hr />
    </header>
  );
};
