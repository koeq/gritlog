import { Header } from "../header";
import { SignInWithGoogle } from ".";

const UnauthedApp = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Header />
      <SignInWithGoogle />
    </div>
  );
};

export default UnauthedApp;
