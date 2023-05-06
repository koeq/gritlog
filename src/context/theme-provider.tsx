import { createContext, useLayoutEffect, useState } from "react";
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

export const useTheme: () => [
  Theme,
  React.Dispatch<React.SetStateAction<Theme>>
] = () => useSafeContext(ThemeContext, "Theme");
