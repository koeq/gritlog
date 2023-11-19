import { useEffect } from "react";
import { Section } from "./app";
import { Theme, useTheme } from "./context";
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
        <Logo theme={theme} />
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

const Logo = ({ theme }: { theme: Theme }) => (
  <svg
    width="24"
    height="22"
    viewBox="0 0 24 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill={theme === "dark" ? "#f7f8f8" : "#000"}
      d="M5.74538 17.328C4.76938 17.328 3.89738 17.08 3.12938 16.584C2.37738 16.088 1.78538 15.392 1.35338 14.496C0.937375 13.6 0.729375 12.576 0.729375 11.424C0.729375 10.144 0.937375 9.024 1.35338 8.064C1.76938 7.088 2.36138 6.336 3.12938 5.808C3.89738 5.264 4.76938 4.992 5.74538 4.992C6.56138 4.992 7.27338 5.184 7.88138 5.568C8.50538 5.952 8.98538 6.496 9.32138 7.2L9.34538 5.28H12.3934V16.128C12.3614 18.08 11.8654 19.528 10.9054 20.472C9.94538 21.416 8.55338 21.888 6.72938 21.888C5.75338 21.888 4.88138 21.736 4.11338 21.432C3.34538 21.144 2.71338 20.728 2.21738 20.184C1.72138 19.64 1.37738 18.992 1.18538 18.24L4.44938 18.024C4.64138 18.488 4.92938 18.84 5.31338 19.08C5.71338 19.336 6.18538 19.464 6.72938 19.464C7.51338 19.464 8.12138 19.224 8.55338 18.744C9.00138 18.28 9.23338 17.608 9.24938 16.728V15.456C8.96138 16 8.48938 16.448 7.83338 16.8C7.17738 17.152 6.48138 17.328 5.74538 17.328ZM4.04138 11.376C4.04138 12.112 4.15338 12.76 4.37738 13.32C4.60138 13.864 4.91338 14.288 5.31338 14.592C5.71338 14.896 6.19338 15.048 6.75338 15.048C7.28138 15.048 7.74538 14.896 8.14538 14.592C8.54538 14.288 8.85738 13.864 9.08138 13.32C9.30538 12.76 9.41738 12.112 9.41738 11.376C9.41738 10.64 9.31338 10 9.10538 9.456C8.89738 8.896 8.58538 8.464 8.16938 8.16C7.76938 7.856 7.29738 7.704 6.75338 7.704C6.19338 7.704 5.71338 7.856 5.31338 8.16C4.91338 8.464 4.60138 8.896 4.37738 9.456C4.15338 10 4.04138 10.64 4.04138 11.376ZM23.736 15.216V18H12.144V15.216H23.736ZM16.632 18V5.112C16.632 4.648 16.52 4.304 16.296 4.08C16.088 3.856 15.76 3.744 15.312 3.744H12.36V0.959999H15.312C16.784 0.959999 17.896 1.312 18.648 2.016C19.4 2.72 19.776 3.752 19.776 5.112V18H16.632Z"
    />
  </svg>
);
