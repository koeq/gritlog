import "../styles/login.css";

export const Login = (): JSX.Element => {
  return (
    <div className="login-layer">
      <div className="login-container">
        <h2>Login to workout ⚡</h2>
        <div id="sign-in-with-google" />
      </div>
    </div>
  );
};
