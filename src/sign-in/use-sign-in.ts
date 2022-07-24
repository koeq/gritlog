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
  setSignedIn: React.Dispatch<React.SetStateAction<boolean>>,
  setUserData: React.Dispatch<unknown>
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
    const data = await res.json();

    // log in if cookie was set
    // case 201 -> user was created
    // case 200 -> user already existed
    if (res.status === 201 || res.status === 200) {
      setSignedIn(true);
    }
    setUserData(data);
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

export const useSignIn = (
  setSignedIn: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [userData, setUserData] = useState<unknown>();

  useEffect(() => {
    const authOrSignIn = async () => {
      try {
        const isAuthenticated = await checkAuthentication();

        if (isAuthenticated) {
          setSignedIn(true);
        } else {
          // use google sign in flow
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_DATA_CLIENT_ID,
            callback: (response) =>
              handleSignInWithGoogle(response, setSignedIn, setUserData),
          });

          // login button
          window.google.accounts.id.renderButton(
            document.getElementById("signIn")!,
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

    authOrSignIn();
  }, []);

  return userData;
};
