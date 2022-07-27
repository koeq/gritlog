import { Header } from "../header";
import { SignIn } from ".";

const UnauthedApp = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Header />
      <SignIn />
    </div>
  );
};

export default UnauthedApp;
