import { useEffect } from "react";
import { Login } from "./auth";
import { useAuth } from "./context";
import { Header } from "./header";
import "./styles/unauthed-app.css";

const UnauthedApp = (): JSX.Element => {
  const { startLoginFlow } = useAuth();
  useEffect(() => startLoginFlow(), [startLoginFlow]);

  return (
    <div className="unauthed">
      <Header authed={false} />
      <Login />
    </div>
  );
};

export default UnauthedApp;
