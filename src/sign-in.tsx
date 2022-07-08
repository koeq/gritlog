import React, { useEffect } from "react";

declare global {
  interface Window {
    handleToken: (response: Response) => void;
  }
}

interface Response {
  clientId: string;
  credential: string;
  select_by: string;
}

interface GoogleUserData {
  iss: string;
  nbf: string;
  aud: string;
  sub: string;
  hd: string;
  email: string;
  email_verified: string;
  azp: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: string;
  exp: string;
  jti: string;
  alg: string;
  kid: string;
  typ: string;
}

const handleToken = async (response: Response) => {
  // const requestOptions = {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "x-api-key": import.meta.env.VITE_GATEWAY_API_KEY,
  //   },
  //   body: JSON.stringify(response.credential),
  // };

  const jsonWebToken = response.credential;
  const authUrl = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${jsonWebToken}`;

  try {
    const res = await fetch(authUrl);
    const googleUserData: GoogleUserData = await res.json();
    const { given_name, family_name, email } = googleUserData;
  } catch (err) {
    console.log(err);
  }
};

export const SignIn = (): JSX.Element => {
  useEffect(() => {
    window.handleToken = handleToken;
  }, []);

  return (
    <>
      <div
        id="g_id_onload"
        data-client_id={import.meta.env.VITE_DATA_CLIENT_ID}
        data-callback={"handleToken"}
        data-auto_prompt="true"
      ></div>

      {/* login button */}
      <div
        className="g_id_signin"
        data-type="standard"
        data-size="large"
        data-theme="outline"
        data-text="sign_in_with"
        data-shape="rectangular"
        data-logo_alignment="left"
      ></div>
    </>
  );
};
