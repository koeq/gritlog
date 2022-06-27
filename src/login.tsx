import React, { useState } from "react";
import "./styles/login.css";

export const Login = (): JSX.Element | null => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>login</h3>
      <input
        type="email"
        value={email}
        onChange={onEmailChange}
        placeholder="email"
        required
      />

      <input
        type="password"
        value={password}
        onChange={onPasswordChange}
        placeholder="password"
        required
      />

      <input type="submit" value="log in" className={"submit"} />
    </form>
  );
};
