import React from "react";
import "./App.css";
import EditorScene from "./editor-utilities/EditorScene"
import Editor from "./editor-utilities/Editor";

//To be selected with file picker soon (dev project root)
export const projectRoot = "../dev-project";

export const server = "http://localhost:8000";
const apiEndpoint = (endpoint: string): string => server + "/" + endpoint;

const postData = (data: object) => {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", apiEndpoint("api/initialize-project"));
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify(data));
};

export const getData = (endpoint: string, params: string): Promise<string> => {
  return fetch(apiEndpoint(endpoint) + params).then((d) => d.text());
};

//+"C:/Users/Ajay/Desktop/Personal Projects/ThreeJS-Scene-Graph/dev-project
const sync = () => {
  const data = {
    project: {
      directory: projectRoot,
    },
  };
  postData(data);
};

function App() {
  const viewportRef: any = React.useRef();
  const scene: EditorScene = new EditorScene();
  const editor = new Editor(scene);
  //TODO: Convert Scene Camera to Camera Component

  React.useEffect(() => {
    scene.setup(viewportRef.current, () => {
      editor.editorLoop();
    });
    getData("sceneJSON", `?root=${projectRoot}`).then((d) => {
      scene.parseSerializedJSON(d);
    });
    scene.render();
  });
  return (
    <div
      className="App"
      style={{ display: "flex", width: "100vw", height: "100vh" }}
    >
      <div style={{ flex: 1 }} ref={viewportRef}>
        <button
          onClick={(e) => {
            sync();
          }}
        >
          Create/Refresh Project
        </button>
        <button
          onClick={(e) => {
            scene.setup(viewportRef.current, () => {
              editor.editorLoop();
            });
            getData("sceneJSON", `?root=${projectRoot}`).then((d) => {
              scene.parseSerializedJSON(d);
            });
            scene.render();
          }}
        >
          Load Project
        </button>
        <button
          onClick={(e) => {
            let sceneJSON = scene.serialize();
            const xhr = new XMLHttpRequest();
            xhr.open("POST", apiEndpoint("api/save-project"));
            xhr.setRequestHeader(
              "Content-Type",
              "application/json;charset=UTF-8"
            );
            xhr.send(
              JSON.stringify({
                directory: projectRoot,
                data: sceneJSON,
              })
            );
          }}
        >
          Save Project
        </button>
      </div>
      {/* <div style={{ flex: 0.3, background: "blue" }}></div> */}
    </div>
  );
}

export default App;
