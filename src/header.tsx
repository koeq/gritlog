import { useEffect } from "react";
import { Hamburger } from "./hamburger";
import "./styles/header.css";
import { ThemeToggle } from "./theme-toggle";

interface HeaderProps {
  readonly authed: boolean;
  readonly menuActive: boolean;
  readonly setMenuActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header = ({
  authed,
  menuActive,
  setMenuActive,
}: HeaderProps): JSX.Element => {
  useEffect(() => {
    setMenuActive(false);
  }, [setMenuActive, authed]);

  return (
    <>
      <header className={`header ${menuActive ? "opaque" : ""}`}>
        <div className="header-container">
          <h1 className="heading">gritlog</h1>
          <div className="cta-section">
            <ThemeToggle />
            {authed && (
              <Hamburger
                menuActive={menuActive}
                setMenuActive={setMenuActive}
              />
            )}
          </div>
        </div>
        <hr />
      </header>
    </>
  );
};
