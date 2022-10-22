import { useEffect } from "react";
import { SignInWithGoogle } from "./auth";
import { useAuth } from "./context/auth-provider";
import { Header } from "./header";
import "./styles/unauthed-app.css";

const UnauthedApp = (): JSX.Element => {
  const { startLoginFlow } = useAuth();
  useEffect(() => startLoginFlow(), []);

  return (
    <div className="unauthed">
      <Header />
      <SignInWithGoogle />
    </div>
  );
};

export default UnauthedApp;
