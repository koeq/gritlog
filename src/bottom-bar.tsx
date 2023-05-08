import { useTopLevelState } from "./context";
import "./styles/bottom-bar.css";

export function BottomBar({
  children,
}: React.PropsWithChildren<{}>): JSX.Element {
  const [{ inputOpen }] = useTopLevelState();

  return (
    <footer className={inputOpen ? "bottom-bar" : "bottom-bar closed"}>
      {children}
    </footer>
  );
}
