import "./styles/header.css";

interface HeaderProps {
  children?: () => JSX.Element;
}

export const Header = ({ children }: HeaderProps): JSX.Element => {
  return (
    <nav className="header">
      <div className="header-container">
        <h1 className="heading">gl</h1>
        {children && children()}
      </div>
      <hr />
    </nav>
  );
};
