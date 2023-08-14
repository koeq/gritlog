import { ReactNode } from "react";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { SlScreenDesktop } from "react-icons/sl";
import { useTheme } from "./context";
import "./styles/theme-toggle.css";

export function ThemeToggle(): JSX.Element {
  const { theme, setTheme, themeType, setThemeType } = useTheme();

  const createHandler =
    (theme: "light" | "dark", themeType: "OS" | "custom") => () => {
      setTheme(theme);
      setThemeType(themeType);
    };

  return (
    <div className="theme-toggle-container">
      <ThemeButton
        ariaLabel="toggle-OS"
        selected={themeType === "OS"}
        clickHandler={createHandler(
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light",
          "OS"
        )}
      >
        <SlScreenDesktop size="22" />
      </ThemeButton>
      <ThemeButton
        ariaLabel="toggle-light"
        clickHandler={createHandler("light", "custom")}
        selected={themeType === "custom" && theme === "light"}
      >
        <HiOutlineSun size="23" />
      </ThemeButton>
      <ThemeButton
        ariaLabel="toggle-dark"
        clickHandler={createHandler("dark", "custom")}
        selected={themeType === "custom" && theme === "dark"}
      >
        <HiOutlineMoon size="23" />
      </ThemeButton>
    </div>
  );
}

interface ThemeButtonProps {
  readonly ariaLabel: string;
  readonly selected: boolean;
  readonly children: ReactNode;
  readonly clickHandler: () => void;
}

function ThemeButton({
  children,
  clickHandler,
  selected,
  ariaLabel,
}: ThemeButtonProps) {
  return (
    <button
      onClick={clickHandler}
      aria-label={ariaLabel}
      className={`theme-toggle-btn ${selected ? "selected" : ""}`}
    >
      {children}
    </button>
  );
}
