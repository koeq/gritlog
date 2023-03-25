import "./styles/bottom-bar.css";

export function BottomBar({
  children,
}: React.PropsWithChildren<{}>): JSX.Element {
  return <footer className="bottom-bar">{children}</footer>;
}
