import { useEffect } from "react";
import { Login } from "./auth";
import { useAuth } from "./context";
import "./styles/unauthed-app.css";

const UnauthedApp = (): JSX.Element => {
  const { startLoginFlow } = useAuth();
  useEffect(() => startLoginFlow(), [startLoginFlow]);

  return (
    <div className="unauthed">
      <Login />
    </div>
  );
};

export default UnauthedApp;
