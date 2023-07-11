import { useEffect } from "react";
import { Login } from "./auth";
import { useAuth } from "./context";
import { Layer } from "./layer";
import "./styles/unauthed-app.css";

const UnauthedApp = ({
  googleScriptLoaded,
}: {
  readonly googleScriptLoaded: boolean;
}): JSX.Element => {
  const { startLoginFlow } = useAuth();

  useEffect(() => {
    if (googleScriptLoaded) {
      startLoginFlow();
    }
  }, [googleScriptLoaded, startLoginFlow]);

  return (
    <div className="unauthed">
      <Layer>
        <Login />
      </Layer>
    </div>
  );
};

export default UnauthedApp;
