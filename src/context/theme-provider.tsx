import { createContext, useEffect, useState } from "react";
import { useSafeContext } from "../utils/use-safe-context";

interface ThemeProviderProps {
  children: React.ReactNode;
}

type Theme = "light" | "dark";

export const ThemeContext = createContext<
  [Theme, React.Dispatch<React.SetStateAction<Theme>>] | undefined
>(undefined);

export const ThemeProvider = ({
  children,
}: ThemeProviderProps): JSX.Element => {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const root = document.body;
    const classToAdd = theme === "light" ? "light" : "dark";
    const classToRemove = theme === "light" ? "dark" : "light";
    root?.classList.add(classToAdd);
    root?.classList.remove(classToRemove);
  }, [theme]);

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme: () => [
  Theme,
  React.Dispatch<React.SetStateAction<Theme>>
] = () => useSafeContext(ThemeContext, "Theme");
