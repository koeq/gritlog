import "./styles/hamburger.css";

interface HamburgerProps {
  readonly menuActive: boolean;
  readonly setMenuActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Hamburger = ({
  menuActive,
  setMenuActive,
}: HamburgerProps): JSX.Element => {
  return (
    <button
      aria-label="menu"
      className={`hamburger ${menuActive ? "active" : ""}`}
      onClick={() => setMenuActive((prev) => !prev)}
    >
      <span className="bar bar1"></span>
      <span className="bar bar2"></span>
    </button>
  );
};
