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

export const deleteAuthCookie = async (): Promise<void> => {
  const requestOptions = {
    ...credentials,
    ...headers,
    method: "DELETE",
  };

  try {
    await fetch(authUrl, requestOptions);
  } catch (err) {
    console.log(err);
  }
};

const checkAuthentication = async (): Promise<boolean> => {
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

export const useAuthed = (): readonly [
  boolean | undefined,
  React.Dispatch<React.SetStateAction<boolean | undefined>>
] => {
  const [authed, setAuthed] = useState<boolean | undefined>();

  useEffect(() => {
    const authenticate = async () => {
      try {
        const isAuthenticated = await checkAuthentication();

        if (isAuthenticated) {
          setAuthed(true);
        } else {
          setAuthed(false);
        }
      } catch (err) {
        console.log(err);
      }
    };

    authenticate();
  }, []);

  return [authed, setAuthed] as const;
};
