import { useEffect, useRef } from "react";
import { useTheme, useTopLevelState } from "./context";
import "./styles/layer.css";

export function BottomBarLayer(): JSX.Element {
  const { theme } = useTheme();
  const layerRef = useRef<HTMLDivElement>(null);
  const [{ mode }, dispatch] = useTopLevelState();

  useEffect(() => {
    const { current } = layerRef;

    if (!current) {
      return;
    }

    const timeoutId = setTimeout(() => {
      current.classList.add("fade-in");
      // TODO: change background color in meta tag
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      ref={layerRef}
      className={`layer muted-background ${
        theme === "light" ? "light" : "dark"
      }`}
      onClick={
        mode.type === "add"
          ? () => dispatch({ type: "cancel-add" })
          : mode.type === "edit"
          ? () => dispatch({ type: "cancel-edit" })
          : undefined
      }
    >
      <></>
    </div>
  );
}
