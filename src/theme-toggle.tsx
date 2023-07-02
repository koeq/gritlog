import { ReactNode } from "react";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { SlScreenDesktop } from "react-icons/sl";
import { useTheme } from "./context/theme-provider";
import "./styles/theme-toggle.css";

export function ThemeToggle(): JSX.Element {
  const { theme, setTheme, themeType, setThemeType } = useTheme();

  return (
    <div className="theme-toggle-container">
      <ThemeButton
        selected={themeType === "OS"}
        clickHandler={() => {
          setTheme(
            window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light"
          );

          setThemeType("OS");
        }}
      >
        <SlScreenDesktop strokeWidth={8} size="15" />
      </ThemeButton>
      <ThemeButton
        selected={themeType === "custom" && theme === "light"}
        clickHandler={() => {
          setTheme("light");
          setThemeType("custom");
        }}
      >
        <HiOutlineSun size="15" />
      </ThemeButton>
      <ThemeButton
        selected={themeType === "custom" && theme === "dark"}
        clickHandler={() => {
          setTheme("dark");
          setThemeType("custom");
        }}
      >
        <HiOutlineMoon size="15" />
      </ThemeButton>
    </div>
  );
}

interface ThemeButtonProps {
  children: ReactNode;
  clickHandler: () => void;
  selected: boolean;
}

function ThemeButton({ children, clickHandler, selected }: ThemeButtonProps) {
  return (
    <button
      className={`theme-toggle-btn ${selected ? "selected" : ""}`}
      aria-label="toggle-theme"
      onClick={clickHandler}
    >
      {children}
    </button>
  );
}
