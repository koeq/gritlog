import { CredentialResponse } from "google-one-tap";
import { useEffect, useState } from "react";

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

const checkAuthentication = async () => {
  const requestOptions = {
    ...credentials,
    ...headers,
    method: "GET",
  };

  try {
    const res = await fetch(authUrl, requestOptions);
    if (res.status !== 200) {
      return false;
    }

    return true;
  } catch (err) {
    console.log(err);

    return false;
  }
};

export const useAuth = (
  setAuthed: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    const authenticate = async () => {
      try {
        const isAuthenticated = await checkAuthentication();

        if (isAuthenticated) {
          setAuthed(true);
        } else {
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
        }
      } catch (err) {
        console.log(err);
      }
    };

    authenticate();
  }, []);
};
