import React, { useState } from "react";
import "./App.css";
import EditorScene from "./editor-utilities/EditorScene";
import Editor from "./editor-utilities/Editor";
import {
  projectRoot,
  getData,
  sync,
  save,
  loadProject,
} from "./server-utilities/serverHandler";

function App() {
  const [startedEngine, setStartedEngine] = useState(false);

  const viewportRef: any = React.useRef();
  const scene: EditorScene = new EditorScene();
  const editor = new Editor(scene);

  React.useEffect(() => {
    if (!startedEngine) {
      loadProject(scene, viewportRef, editor);
      setStartedEngine(true);
    }
  });

  return (
    <div
      className="App"
      style={{ display: "flex", width: "100vw", height: "100vh" }}
    >
      <div style={{ flex: 1 }} ref={viewportRef}>
        <button onClick={(e) => sync()}>Create/Refresh Project</button>
        <button onClick={(e) => loadProject(scene, viewportRef, editor)}>
          Load Project
        </button>
        <button onClick={(e) => save(scene)}>Save Project</button>
      </div>
      {/* <div style={{ flex: 0.3, background: "blue" }}></div> */}
    </div>
  );
}

export default App;
