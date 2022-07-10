import { CredentialResponse } from "google-one-tap";

export const handleSignIn = async (
  response: CredentialResponse,
  setJsonWebToken: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  const jsonWebToken = response.credential;

  setJsonWebToken(jsonWebToken);
  // const authUrl = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${jsonWebToken}`;

  // try {
  //   const res = await fetch(authUrl);
  //   const googleUserData = await res.json();
  //   const { given_name, family_name, email } = googleUserData;
  // } catch (err) {
  //   console.log(err);
  // }
};
