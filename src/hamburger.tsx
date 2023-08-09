import "./styles/hamburger.css";

interface HamburgerProps {
  readonly menuOpen: boolean;
  readonly setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Hamburger = ({
  menuOpen,
  setMenuOpen,
}: HamburgerProps): JSX.Element => {
  return (
    <button
      aria-label="menu"
      className={`hamburger ${menuOpen ? "active" : ""}`}
      onClick={() => setMenuOpen((prev) => !prev)}
    >
      <span className="bar bar1"></span>
      <span className="bar bar2"></span>
    </button>
  );
};
