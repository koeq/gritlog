import {
  ReactNode,
  createContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useSafeContext } from "../utils/use-safe-context";

interface ThemeProviderProps {
  children: ReactNode;
}

type Theme = "light" | "dark";

export const ThemeContext = createContext<
  [Theme, React.Dispatch<React.SetStateAction<Theme>>] | undefined
>(undefined);

export const ThemeProvider = ({
  children,
}: ThemeProviderProps): JSX.Element => {
  const [theme, setTheme] = useState<Theme>(getDefaultTheme);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useLayoutEffect(() => {
    const previousTheme = theme === "light" ? "dark" : "light";
    document.documentElement.classList.remove(previousTheme);
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  );
};

const getDefaultTheme = (): "light" | "dark" => {
  const storedTheme = localStorage.getItem("theme");

  return storedTheme === "light" || storedTheme === "dark"
    ? storedTheme
    : "light";
};

export const useTheme: () => [
  Theme,
  React.Dispatch<React.SetStateAction<Theme>>
] = () => useSafeContext(ThemeContext, "Theme");
