import {
  ReactNode,
  createContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import "../styles/index.css";
import { useSafeContext } from "../utils/use-safe-context";

interface ThemeProviderProps {
  children: ReactNode;
}

type Theme = "light" | "dark";
type ThemeType = "OS" | "custom";

interface ThemeContextProps {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  themeType: ThemeType;
  setThemeType: React.Dispatch<React.SetStateAction<ThemeType>>;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(
  undefined
);

export const ThemeProvider = ({
  children,
}: ThemeProviderProps): JSX.Element => {
  const [theme, setTheme] = useState<Theme>(getDefaultTheme);

  const [themeType, setThemeType] = useState<"OS" | "custom">(
    localStorage.getItem("theme") ? "custom" : "OS"
  );

  // Persist users preference
  useEffect(() => {
    if (themeType === "OS") {
      localStorage.removeItem("theme");

      return;
    }

    localStorage.setItem("theme", theme);
  }, [theme, themeType]);

  useEffect(() => {
    if (themeType === "custom") {
      return;
    }

    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const setOSTheme = (e: MediaQueryListEvent) =>
      setTheme(e.matches ? "dark" : "light");

    setOSTheme({
      matches: darkModeMediaQuery.matches,
    } as MediaQueryListEvent);

    darkModeMediaQuery.addEventListener("change", setOSTheme);

    return () => {
      darkModeMediaQuery.removeEventListener("change", setOSTheme);
    };
  }, [themeType, setTheme]);

  useLayoutEffect(() => {
    const previousTheme = theme === "light" ? "dark" : "light";
    document.documentElement.classList.remove(previousTheme);
    document.documentElement.classList.add(theme);
    document.documentElement.style.colorScheme = theme;
    setMetaThemeColor(theme === "light" ? "#fafafe" : "#07090f");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeType, setThemeType }}>
      {children}
    </ThemeContext.Provider>
  );
};

const getDefaultTheme = (): "light" | "dark" => {
  const storedTheme = localStorage.getItem("theme");

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

// TODO: this is hacky and can be solved in a better way:
// https://css-tricks.com/meta-theme-color-and-trickery/
export function setMetaThemeColor(color: string): void {
  const metaThemeColor = document.querySelector("meta[name=theme-color]");

  if (!metaThemeColor) {
    return;
  }

  metaThemeColor.setAttribute("content", color);
}

export const useTheme: () => ThemeContextProps = () =>
  useSafeContext(ThemeContext, "Theme");
