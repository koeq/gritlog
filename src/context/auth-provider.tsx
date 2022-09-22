import { CredentialResponse } from "google-one-tap";
import React, { createContext, useContext } from "react";
import { auth } from "../auth";
import { useSafeContext } from "../utils/use-safe-context";

const authUrl = import.meta.env.VITE_AUTH_URL;
const credentials: {
  credentials: RequestCredentials;
} = {
  credentials: "include",
};

const headers = {
  headers: {
    "Content-Type": "application/json",
    "x-api-key": import.meta.env.VITE_GATEWAY_API_KEY,
  },
};

const handleSignInWithGoogle = async (
  response: CredentialResponse,
  setAuthed: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const requestOptions = {
    ...credentials,
    ...headers,
    method: "POST",
    // send the JSON web token
    body: JSON.stringify(response.credential),
  };

  try {
    const res = await fetch(authUrl, requestOptions);

    /* case 201 -> user was created
       case 200 -> user already existed */
    if (res.status === 201 || res.status === 200) {
      setAuthed(true);
    }
  } catch (err) {
    console.log(err);
  }
};

interface AuthContextTypes {
  authed: boolean;
  logout: () => void;
  login: () => void;
}

const AuthContext = createContext<AuthContextTypes | undefined>(undefined);

// TO DO: type props correctly
export const AuthProvider = (props: any) => {
  const [authed, setAuthed] = auth();

  const logout = () => setAuthed(false);
  const login = () => {
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
        shape: "rectangular",
        theme: "outline",
        size: "large",
      }
    );
  };

  return <AuthContext.Provider value={{ authed, logout, login }} {...props} />;
};

export const useAuth = () => useSafeContext(AuthContext, "Auth context");
