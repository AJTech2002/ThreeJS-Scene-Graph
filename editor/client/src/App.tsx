import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

const server = "http://localhost:8000";

const apiEndpoint = (endpoint: string): string => server + "/" + endpoint;

function App() {
  const [data, setData] = useState("");

  React.useEffect(() => {
    fetch(apiEndpoint("api"))
      .then((d) => d.text())
      .then((d) => setData(d));
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{data}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
