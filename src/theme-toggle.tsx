import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { Theme } from "./context/theme-provider";

interface ThemeToggleProps {
  theme: Theme;
  toggleTheme: () => void;
}

export function ThemeToggle({
  theme,
  toggleTheme,
}: ThemeToggleProps): JSX.Element {
  return (
    <button
      aria-label="toggle-theme"
      style={{
        display: "flex",
        color: "var(--text-primary)",
        marginRight: "12px",
      }}
      onClick={toggleTheme}
    >
      {theme === "light" ? (
        <HiOutlineSun size="20" />
      ) : (
        <HiOutlineMoon size="20" />
      )}
    </button>
  );
}
