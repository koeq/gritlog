import { useEffect, useRef } from "react";
import { useTheme } from "./context/theme-provider";
import "./styles/layer.css";

export function BottomBarLayer(): JSX.Element {
  const { theme } = useTheme();
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { current } = layerRef;

    if (!current) {
      return;
    }

    const timeoutId = setTimeout(() => current.classList.add("fade-in"), 0);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      ref={layerRef}
      className={`layer muted-background ${
        theme === "light" ? "light" : "dark"
      }`}
    >
      <></>
    </div>
  );
}
