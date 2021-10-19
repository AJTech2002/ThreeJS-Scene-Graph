import Editor from "../editor-utilities/Editor";
import EditorScene from "../editor-utilities/EditorScene";

//To be selected with file picker soon (dev project root)
export const projectRoot = "../dev-project";

export const server = "http://localhost:8000";

export const apiEndpoint = (endpoint: string): string =>
  server + "/" + endpoint;

//Get data at end point with parameters
export const getData = (endpoint: string, params: string): Promise<string> => {
  return fetch(apiEndpoint(endpoint) + params).then((d) => d.text());
};

//Sync (or Create project) -- creates properties and serializes them
export const sync = () => {
  const data = {
    project: {
      directory: projectRoot,
    },
  };
  const xhr = new XMLHttpRequest();
  xhr.open("POST", apiEndpoint("api/initialize-project"));
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify(data));
};

//Save current project

export const save = (scene: EditorScene) => {
  let sceneJSON = scene.serialize();
  const xhr = new XMLHttpRequest();
  xhr.open("POST", apiEndpoint("api/save-project"));
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(
    JSON.stringify({
      directory: projectRoot,
      data: sceneJSON,
    })
  );
};

//Load project in from directory
export const loadProject = (
  scene: EditorScene,
  viewportRef: any,
  editor: Editor
) => {
  getData("api/scene-json", `?root=${projectRoot}`).then((d) => {
    console.log(d);
    scene.parseSerializedJSON(d);
  });
  scene.setup(viewportRef.current, () => {
    editor.editorLoop();
  });
  scene.render();
};
