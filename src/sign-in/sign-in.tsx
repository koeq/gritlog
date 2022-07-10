// interface GoogleUserData {
//   iss: string;
//   nbf: string;
//   aud: string;
//   sub: string;
//   hd: string;
//   email: string;
//   email_verified: string;
//   azp: string;
//   name: string;
//   picture: string;
//   given_name: string;
//   family_name: string;
//   iat: string;
//   exp: string;
//   jti: string;
//   alg: string;
//   kid: string;
//   typ: string;
// }

// const handleToken = async (response: Response) => {
// const requestOptions = {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     "x-api-key": import.meta.env.VITE_GATEWAY_API_KEY,
//   },
//   body: JSON.stringify(response.credential),
// };

//   const jsonWebToken = response.credential;
//   const authUrl = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${jsonWebToken}`;

//   try {
//     const res = await fetch(authUrl);
//     const googleUserData: GoogleUserData = await res.json();
//     const { given_name, family_name, email } = googleUserData;
//   } catch (err) {
//     console.log(err);
//   }

export const SignIn = ({ loggedIn }: { loggedIn: boolean }): JSX.Element => {
  return (
    <div
      style={
        loggedIn
          ? { display: "none" }
          : {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
              position: "fixed",
              backdropFilter: "blur(6px)",
            }
      }
    >
      <div id="signIn"></div>
    </div>
  );
};
