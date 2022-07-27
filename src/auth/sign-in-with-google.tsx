export const SignInWithGoogle = (): JSX.Element => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        position: "fixed",
        // TO DO: backdropFilter is not supported by firefox
        backdropFilter: "blur(6px)",
      }}
    >
      <div id="signInWithGoogle"></div>
    </div>
  );
};
