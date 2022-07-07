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
const handleToken = (response: Response) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_GATEWAY_API_KEY,
    },
    body: JSON.stringify(response.credential),
  };
  fetch(
    "https://pp98tw0fj6.execute-api.eu-central-1.amazonaws.com/prod/user",
    requestOptions
  )
    .then((res) => res.json())
    .then((data) => console.log(data));
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
