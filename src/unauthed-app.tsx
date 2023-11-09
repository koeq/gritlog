import { useEffect } from "react";
import { Login } from "./auth";
import { useAuth } from "./context";
import "./styles/unauthed-app.css";

const UnauthedApp = ({
  isGoogleScriptLoaded,
}: {
  readonly isGoogleScriptLoaded: boolean;
}): JSX.Element => {
  const { startLoginFlow } = useAuth();

  useEffect(() => {
    if (isGoogleScriptLoaded) {
      startLoginFlow();
    }
  }, [isGoogleScriptLoaded, startLoginFlow]);

  return (
    <div className="unauthed">
      <Login />
    </div>
  );
};

export default UnauthedApp;
