import React, { createContext, Suspense, useState } from "react";
import { useAuth } from "./auth";

const AuthedApp = React.lazy(() => import("./authed-app"));
const UnauthedApp = React.lazy(() => import("./auth/unauthed-app"));

export const SetAuthedContext = createContext<
  React.Dispatch<React.SetStateAction<boolean>> | undefined
>(undefined);

export const App = () => {
  const [authed, setAuthed] = useState(false);

  useAuth(setAuthed);

  return (
    <Suspense fallback={<></>}>
      <SetAuthedContext.Provider value={setAuthed}>
        {authed ? <AuthedApp /> : <UnauthedApp />}
      </SetAuthedContext.Provider>
    </Suspense>
  );
};
