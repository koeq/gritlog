import "../styles/login.css";

export const Login = (): JSX.Element => {
  return (
    <div className="login-container">
      <h1>gritlog</h1>
      <p>
        The text based <br /> stength training journal.
      </p>
      <hr />
      <div id="sign-in-with-google" />
    </div>
  );
};
