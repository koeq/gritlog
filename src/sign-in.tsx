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
  console.log(response.credential);
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
      {/* <div
        className="g_id_signin"
        data-type="standard"
        data-size="large"
        data-theme="outline"
        data-text="sign_in_with"
        data-shape="rectangular"
        data-logo_alignment="left"
      ></div> */}
    </>
  );
};
