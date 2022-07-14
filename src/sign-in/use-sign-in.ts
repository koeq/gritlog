import { useEffect, useState } from "react";
import { CredentialResponse } from "google-one-tap";

const authUrl =
  "https://pp98tw0fj6.execute-api.eu-central-1.amazonaws.com/prod/auth";

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

const handleSignIn = async (
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
    if (res.status === 200) {
      setSignedIn(true);
    }
  } catch (err) {
    console.log(err);
  }
};

export const useSignIn = (
  setSignedIn: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    const authenticate = async () => {
      const requestOptions = {
        ...credentials,
        ...headers,
        method: "GET",
      };
      try {
        const res = await fetch(authUrl, requestOptions);
        const data = await res.json();
        if (data.cookie) {
          setSignedIn(true);
        } else {
          // use google sign in flow
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_DATA_CLIENT_ID,
            callback: (response) => handleSignIn(response, setSignedIn),
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

    authenticate();
  }, []);
};
