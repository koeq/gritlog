import { useEffect, useState } from "react";
import { CredentialResponse } from "google-one-tap";

const handleSignIn = async (
  response: CredentialResponse,
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const authUrl =
    "https://pp98tw0fj6.execute-api.eu-central-1.amazonaws.com/prod/auth";

  const requestOptions = {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_GATEWAY_API_KEY,
    },
    // send the JSON web token
    body: JSON.stringify(response.credential),
  } as const;

  try {
    const res = await fetch(authUrl, requestOptions);

    // log in if cookie was set
    if (res.status === 200) {
      setLoggedIn(true);
    }
  } catch (err) {
    console.log(err);
  }
};

export const useSignIn = (
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_DATA_CLIENT_ID,
      callback: (response) => handleSignIn(response, setLoggedIn),
    });

    // login button
    window.google.accounts.id.renderButton(document.getElementById("signIn")!, {
      shape: "rectangular",
      theme: "outline",
      size: "large",
    });

    // one tap button
    window.google.accounts.id.prompt();
  }, []);
};
