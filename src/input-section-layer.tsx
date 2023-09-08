import { useEffect, useRef } from "react";
import { setMetaThemeColor, useTheme, useTopLevelState } from "./context";
import "./styles/layer.css";

export function InputSectionLayer(): JSX.Element {
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
      setMetaThemeColor(theme === "light" ? "#E4E6EC" : "#262A33");
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      const rootStyle = getComputedStyle(document.documentElement);

      const backgroundColor = rootStyle.getPropertyValue(
        "--background-primary"
      );

      setMetaThemeColor(backgroundColor);
    };
  }, [theme]);

  return (
    <div
      ref={layerRef}
      className="layer muted-background"
      onClick={
        mode.type === "add"
          ? () => dispatch({ type: "cancel-add" })
          : mode.type === "edit"
          ? () => dispatch({ type: "cancel-edit" })
          : undefined
      }
    ></div>
  );
}
