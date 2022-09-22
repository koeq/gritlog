import { Header } from "./header";
import { SignInWithGoogle } from "./auth";
import { useEffect } from "react";
import { useAuth } from "./context/auth-provider";
import "./styles/unauthed-app.css";

const UnauthedApp = () => {
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
