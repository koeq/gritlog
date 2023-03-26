import "./styles/bottom-bar.css";

export function BottomBar({
  children,
  inputOpen,
}: React.PropsWithChildren<{ inputOpen: boolean }>): JSX.Element {
  return (
    <footer className={inputOpen ? "bottom-bar" : "bottom-bar closed"}>
      {children}
    </footer>
  );
}
