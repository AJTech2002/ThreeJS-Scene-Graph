import file, { readFileSync, writeFileSync } from "fs";
import { propGeneratorJS } from "./generatorFiles";

const defaultComponentNames = [
  "CameraComponent",
  "GameComponent",
  "GameObject",
  "Input",
  "MeshComponent",
  "Scene",
  "TransformComponent",
];

export const createFolderIfDoesntExist = (pathA: string, pathB: string) => {
  if (!file.existsSync(pathA + "/" + pathB)) {
    file.mkdirSync(pathA + "/" + pathB);
  }
};

export const writeFileInFolder = (
  folder: string,
  filename: string,
  data: string,
  force: boolean = false
) => {
  if (!file.existsSync(folder + "/" + filename) || force) {
    writeFileSync(folder + "/" + filename, data);
  }
};

export const createFolderStructure = (rootFolder: string, rootName: string) => {
  createFolderIfDoesntExist(rootFolder, rootName);
  createFolderIfDoesntExist(rootFolder + "/" + rootName, "component-props");
  createFolderIfDoesntExist(rootFolder + "/" + rootName, "utility");
  createFolderIfDoesntExist(rootFolder + "/" + rootName, "defaultComponents");
  writeFileInFolder(
    rootFolder + "/" + rootName + "/utility",
    "propGenerator.ts",
    propGeneratorJS
  );
  writeFileInFolder(
    rootFolder + "/" + rootName,
    "scene.json",
    `{
      "gameObjects":[]
  }`
  );
};

export const writeDefaultComponents = (rootFolder: string) => {
  defaultComponentNames.forEach((defaultComp) => {
    let input: string =
      __dirname.replace("\\src", "/public") +
      `/storage/defaultComponents/${defaultComp}.ts`;
    let output: string = rootFolder + `/${defaultComp}.ts`;
    if (file.existsSync(input) && !file.existsSync(output))
      file.copyFileSync(input, output);
  });
};

export const writeComponentsJSON = (
  root: string,
  components: string[],
  componentFiles: string[],
  force = false
) => {
  //Gets prop for a component (inheritance not supported yet)
  for (let c = 0; c < componentFiles.length; c++) {
    let file = componentFiles[c];
    let componentJSON: any = {};
    let text = readFileSync(file).toString();
    let lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (line.includes("//")) {
        if (line.includes("[") && line.includes("]") && line.includes("prop")) {
          let propRaw = line
            .replace("[", "")
            .replace("]", "")
            .replace("//", "")
            .replace("prop", "")
            .trim();
          let propRawSplit = propRaw.split(" ");
          if (propRawSplit.length === 2) {
            componentJSON[propRawSplit[0]] = {
              type: propRawSplit[1],
            };
          }
        }
      }
    }
    writeFileInFolder(
      root + "/" + "component-props",
      components[c] + ".props.json",
      JSON.stringify(componentJSON),
      force
    );
  }
};

export const writeComponentsJS = (
  root: string,
  files: string[],
  absoluteRoot: string
) => {
  let fileString = "";
  let componentNames = files.map((e) => {
    return e
      .replace(".js", "")
      .replace(".ts", "")
      .substr(e.lastIndexOf("/") + 1, e.length - e.lastIndexOf("/"));
  });

  writeComponentsJSON(root, componentNames, files, true);

  let relativeComponentPaths = files.map((e) => {
    return e.replace(absoluteRoot, "..");
  });

  for (let i = 0; i < relativeComponentPaths.length; i++) {
    fileString += `import ${componentNames[i]} from '${relativeComponentPaths[i]}'; \n`;
    fileString += `import * as ${
      componentNames[i] + "Props"
    } from './component-props/${componentNames[i]}.props.json';\n`;
  }

  fileString += "export const Components = {\n";
  for (let i = 0; i < componentNames.length; i++) {
    if (i !== componentNames.length - 1)
      fileString += componentNames[i] + "," + "\n";
    else fileString += componentNames[i] + "\n";
  }
  fileString += "};\n\n";

  fileString += "export const returnProperty = (component, property) => { \n";
  fileString += "const ComponentProperties = {\n";
  for (let i = 0; i < componentNames.length; i++) {
    if (i !== componentNames.length - 1)
      fileString += componentNames[i] + "Props," + "\n";
    else fileString += componentNames[i] + "Props" + "\n";
  }
  fileString += "};\n";
  fileString += `return ComponentProperties[component+"Props"].default[property]; \n`;
  fileString += "}";
  writeFileInFolder(root, "components.js", fileString, true);
};
