import { Header } from "../header";
import { SignInWithGoogle } from ".";
import "../styles/unauthed-app.css";

const UnauthedApp = () => {
  return (
    <div className="unauthed">
      <Header />
      <SignInWithGoogle />
    </div>
  );
};

export default UnauthedApp;
