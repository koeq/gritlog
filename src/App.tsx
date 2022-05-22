import React, { useState } from "react";
import "./App.css";
import { Header } from "./header";
import { Input } from "./input";
import { Table } from "./table";

function App() {
  const [text, setText] = useState<string>();

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.currentTarget.value);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Header />
      <br />
      <Input handleChange={handleChange} text={text} />
      <br></br>
      <br></br>
      <Table text={text} />
    </div>
  );
}

export default App;
