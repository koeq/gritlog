export const SignIn = ({ signedIn }: { signedIn: boolean }): JSX.Element => {
  return (
    <div
      style={
        signedIn
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
