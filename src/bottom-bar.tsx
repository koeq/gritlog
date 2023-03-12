import "./styles/bottom-bar.css";

export function BottomBar({
  children,
}: React.PropsWithChildren<{}>): JSX.Element {
  return <div className="bottom-bar">{children}</div>;
}
