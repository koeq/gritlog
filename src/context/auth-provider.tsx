import { createContext } from "react";
import { auth } from "../auth";
import { handleSignInWithGoogle } from "../auth/handle-sign-in-with-google";
import { useSafeContext } from "../utils/use-safe-context";

interface AuthContextTypes {
  authed: boolean;
  logout: () => void;
  startLoginFlow: () => void;
}

const AuthContext = createContext<AuthContextTypes | undefined>(undefined);

// TO DO: type props correctly
export const AuthProvider = (props: any) => {
  const [authed, setAuthed] = auth();

  const logout = () => setAuthed(false);
  const startLoginFlow = () => {
    // use google sign in flow
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_DATA_CLIENT_ID,
      callback: (response) => handleSignInWithGoogle(response, setAuthed),
    });
    // one tap button
    window.google.accounts.id.prompt();

    // login button
    window.google.accounts.id.renderButton(
      document.getElementById("signInWithGoogle")!,
      {
        shape: "pill",
        theme: "outline",
        size: "large",
        logo_alignment: "left",
        text: "signin_with",
      }
    );
  };

  return (
    <AuthContext.Provider
      value={{ authed, logout, startLoginFlow }}
      {...props}
    />
  );
};

export const useAuth = () => useSafeContext(AuthContext, "Auth");
