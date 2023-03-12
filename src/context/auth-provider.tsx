import { createContext } from "react";
import { deleteAuthCookie, useAuthed } from "../auth";
import { handleSignInWithGoogle } from "../auth/handle-sign-in-with-google";
import { useSafeContext } from "../utils/use-safe-context";

interface AuthProviderProps {
  [x: string]: unknown;
}

interface AuthContext {
  authed: boolean | undefined;
  logout: () => void;
  startLoginFlow: () => void;
}

const authContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider = (props: AuthProviderProps): JSX.Element => {
  const [authed, setAuthed] = useAuthed();

  const logout = () => {
    deleteAuthCookie();
    setAuthed(false);
  };

  const startLoginFlow = () => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_DATA_CLIENT_ID,
      callback: (response) => handleSignInWithGoogle(response, setAuthed),
    });

    const signInWithGoogleButton = document.getElementById(
      "sign-in-with-google"
    );

    if (signInWithGoogleButton) {
      window.google.accounts.id.renderButton(signInWithGoogleButton, {
        shape: "pill",
        theme: "filled_blue",
        size: "medium",
        logo_alignment: "center",
        type: "standard",
        text: "continue_with",
      });
    }
  };

  return (
    <authContext.Provider
      value={{ authed, logout, startLoginFlow }}
      {...props}
    />
  );
};

export const useAuth: () => AuthContext = () =>
  useSafeContext(authContext, "auth");
