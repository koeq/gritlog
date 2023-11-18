import { useEffect } from "react";
import { Section } from "./app";
import { useTheme } from "./context";
import { Hamburger } from "./hamburger";
import { SearchBox } from "./search-box";
import "./styles/header.css";

const analyticsTypes = ["activity", "volume"] as const;

interface HeaderProps {
  readonly isAuthed: boolean;
  readonly section: Section;
  readonly menuOpen: boolean;
  readonly setSection: React.Dispatch<React.SetStateAction<Section>>;
  readonly setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header = ({
  isAuthed,
  section,
  menuOpen,
  setSection,
  setMenuOpen,
}: HeaderProps): JSX.Element => {
  const { theme } = useTheme();

  useEffect(() => {
    setMenuOpen(false);
  }, [setMenuOpen, isAuthed]);

  return (
    <header className="header">
      <div className="header-container">
        <span
          id="logo"
          style={{
            color: theme === "dark" ? "#E5E5E7" : "var(--text-primary)",
          }}
        >
          gl
        </span>

        {isAuthed && (
          <div className="cta-section">
            {section.type === "trainings" && <SearchBox />}
            {section.type === "analytics" &&
              analyticsTypes.map((type) => (
                <div
                  className={`analytics-link-container${
                    section.analyticsType === type ? " active" : ""
                  }`}
                  key={type}
                >
                  <a
                    onClick={() =>
                      setSection({ type: "analytics", analyticsType: type })
                    }
                    className={`analytics-link${
                      section.analyticsType === type ? " active" : ""
                    }`}
                  >
                    {type}
                  </a>
                </div>
              ))}

            <Hamburger menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          </div>
        )}
      </div>
      <hr />
    </header>
  );
};
