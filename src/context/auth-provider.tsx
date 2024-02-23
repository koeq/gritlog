import { createContext } from "react";
import { deleteAuthCookie, useIsAuthed } from "../auth";
import { handleSignInWithGoogle } from "../auth/handle-sign-in-with-google";
import { useSafeContext } from "../utils/use-safe-context";

interface AuthProviderProps {
  [x: string]: unknown;
}

interface AuthContext {
  isAuthed: boolean | undefined;
  logout: () => void;
  startLoginFlow: () => void;
}

const authContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider = (props: AuthProviderProps): JSX.Element => {
  const { isAuthed, setIsAuthed } = useIsAuthed();

  const logout = () => {
    deleteAuthCookie();
    setIsAuthed(false);
  };

  const startLoginFlow = () => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_DATA_CLIENT_ID,
      callback: (response) => handleSignInWithGoogle(response, setIsAuthed),
    });

    const signInWithGoogleButton = document.getElementById(
      "sign-in-with-google"
    );

    if (signInWithGoogleButton) {
      window.google.accounts.id.renderButton(signInWithGoogleButton, {
        shape: "rectangular",
        theme: "filled_blue",
        size: "large",
        logo_alignment: "center",
        type: "standard",
        text: "continue_with",
        width: 250,
      });
    }
  };

  return (
    <authContext.Provider
      value={{ isAuthed, logout, startLoginFlow }}
      {...props}
    />
  );
};

export const useAuth: () => AuthContext = () =>
  useSafeContext(authContext, "auth");
