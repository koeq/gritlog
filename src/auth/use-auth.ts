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
  setSignedIn: React.Dispatch<React.SetStateAction<boolean>>
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

    // log in if cookie was set
    // case 201 -> user was created
    // case 200 -> user already existed
    if (res.status === 201 || res.status === 200) {
      setSignedIn(true);
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

export const useAuth = () => {
  const [authed, setAuthed] = useState(false);

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

          // login button
          window.google.accounts.id.renderButton(
            document.getElementById("signInWithGoogle")!,
            {
              shape: "rectangular",
              theme: "outline",
              size: "large",
            }
          );

          // one tap button
          window.google.accounts.id.prompt();
        }
      } catch (err) {
        console.log(err);
      }
    };

    authenticate();
  }, []);

  return authed;
};
