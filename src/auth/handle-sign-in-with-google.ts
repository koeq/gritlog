import { CredentialResponse } from "google-one-tap";

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

export const handleSignInWithGoogle = async (
  response: CredentialResponse,
  setAuthed: React.Dispatch<React.SetStateAction<boolean | undefined>>
): Promise<void> => {
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
