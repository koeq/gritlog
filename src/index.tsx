import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./app";
import { AppProviders } from "./context";
import "./styles/index.css";

ReactDOM.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
  document.getElementById("root")
);
