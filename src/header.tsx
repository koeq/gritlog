import "./styles/header.css";

interface HeaderProps {
  children?: () => JSX.Element;
}

export const Header = ({ children }: HeaderProps): JSX.Element => {
  return (
    <div className="header">
      <h1 className="heading">backslash</h1>
      {children && children()}
    </div>
  );
};
