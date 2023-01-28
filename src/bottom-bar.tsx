import "./styles/bottom-bar.css";

interface BottomBarProps {
  children: () => JSX.Element;
}

export function BottomBar({ children }: BottomBarProps): JSX.Element {
  return <div className="bottom-bar">{children()}</div>;
}
