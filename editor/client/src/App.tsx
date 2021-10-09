import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

const server = "http://localhost:8000";
const apiEndpoint = (endpoint: string): string => server + "/" + endpoint;

const postData = (data: object) => {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", apiEndpoint("api/initialize-project"));
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify(data));
};

const getData = (params: string): Promise<string> => {
  return fetch(apiEndpoint("api?" + params)).then((d) => d.text());
};

function App() {
  const [data, setData] = useState("");

  React.useEffect(() => {});

  return (
    <div className="App">
      <button
        onClick={(e) => {
          const data = {
            project: {
              directory:
                "C:/Users/Ajay/Desktop/Personal Projects/ThreeJS-Scene-Graph/dev-project",
            },
          };
          postData(data);
        }}
      >
        Generate Project Files
      </button>
    </div>
  );
}

export default App;
