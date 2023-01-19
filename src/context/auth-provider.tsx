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
    // use google sign in flow
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_DATA_CLIENT_ID,
      callback: (response) => handleSignInWithGoogle(response, setAuthed),
    });

    // login button
    const signInWithGoogleElement = document.getElementById("signInWithGoogle");

    if (signInWithGoogleElement) {
      window.google.accounts.id.renderButton(signInWithGoogleElement, {
        shape: "pill",
        theme: "outline",
        size: "large",
        logo_alignment: "left",
        text: "signin_with",
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
  useSafeContext(authContext, "Auth");
