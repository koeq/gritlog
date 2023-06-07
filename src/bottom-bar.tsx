import { useTopLevelState } from "./context";
import "./styles/bottom-bar.css";

export function BottomBar({
  children,
}: React.PropsWithChildren<{}>): JSX.Element {
  const [{ showBottomBar }] = useTopLevelState();

  return (
    <footer className={`bottom-bar ${showBottomBar ? "" : "closed"}`}>
      {children}
    </footer>
  );
}
