import { useEffect, useState } from "react";
import { handleSignIn } from "./handle-sign-in";

export const useSignIn = () => {
  const [jsonWebToken, setWebJsonToken] = useState<string>();

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_DATA_CLIENT_ID,
      callback: (response) => handleSignIn(response, setWebJsonToken),
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

  return jsonWebToken;
};
