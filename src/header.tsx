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
                  className={`analytics-link-container${section.analyticsType === type ? " active" : ""
                    }`}
                  key={type}
                >
                  <a
                    onClick={() =>
                      setSection({ type: "analytics", analyticsType: type })
                    }
                    className={`analytics-link${section.analyticsType === type ? " active" : ""
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
      d="M5.62538 17.328C4.68138 17.328 3.83338 17.088 3.08138 16.608C2.34538 16.112 1.76938 15.424 1.35338 14.544C0.937375 13.648 0.729375 12.632 0.729375 11.496C0.729375 10.2 0.929375 9.064 1.32938 8.088C1.74538 7.096 2.32138 6.336 3.05738 5.808C3.80938 5.264 4.66538 4.992 5.62538 4.992C6.44138 4.992 7.14538 5.184 7.73738 5.568C8.32938 5.936 8.79338 6.472 9.12938 7.176L9.17738 5.28H12.4894V15.984C12.4414 18 11.9454 19.488 11.0014 20.448C10.0734 21.408 8.68138 21.888 6.82538 21.888C5.81738 21.888 4.92138 21.736 4.13738 21.432C3.36938 21.144 2.73738 20.728 2.24138 20.184C1.74538 19.656 1.40138 19.016 1.20938 18.264L4.76138 18.024C4.93738 18.456 5.20138 18.784 5.55338 19.008C5.90538 19.232 6.32938 19.344 6.82538 19.344C7.51338 19.344 8.05738 19.104 8.45738 18.624C8.85738 18.16 9.06538 17.488 9.08138 16.608V15.528C8.79338 16.056 8.32938 16.488 7.68938 16.824C7.04938 17.16 6.36138 17.328 5.62538 17.328ZM4.32938 11.424C4.32938 12.144 4.43338 12.776 4.64138 13.32C4.84938 13.848 5.13738 14.256 5.50538 14.544C5.87338 14.832 6.31338 14.976 6.82538 14.976C7.32138 14.976 7.75338 14.832 8.12138 14.544C8.48938 14.256 8.76938 13.848 8.96138 13.32C9.16938 12.776 9.27338 12.144 9.27338 11.424C9.27338 10.72 9.17738 10.104 8.98538 9.576C8.79338 9.032 8.50538 8.616 8.12138 8.328C7.75338 8.04 7.32138 7.896 6.82538 7.896C6.31338 7.896 5.87338 8.04 5.50538 8.328C5.13738 8.616 4.84938 9.032 4.64138 9.576C4.43338 10.104 4.32938 10.72 4.32938 11.424ZM23.736 14.976V18H12.12V14.976H23.736ZM16.488 18V5.328C16.488 4.88 16.376 4.544 16.152 4.32C15.944 4.096 15.624 3.984 15.192 3.984H12.264V0.959999H15.192C16.744 0.959999 17.912 1.328 18.696 2.064C19.496 2.8 19.896 3.888 19.896 5.328V18H16.488Z"
    />
  </svg>
);
