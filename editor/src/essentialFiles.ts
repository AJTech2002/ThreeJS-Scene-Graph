import file, {
  fstat,
  readFile,
  readFileSync,
  stat,
  statSync,
  writeFileSync,
} from "fs";
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
  data: string
) => {
  if (!file.existsSync(folder + "/" + filename)) {
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

export const writeComponentsJSON = (root: string, components: string[]) => {
  components.forEach((comp) => {
    writeFileInFolder(
      root + "/" + "component-props",
      comp + ".props.json",
      "{}"
    );
  });
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

  writeComponentsJSON(root, componentNames);

  let relativeComponentPaths = files.map((e) => {
    return e.replace(absoluteRoot, "...");
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
  writeFileInFolder(root, "components.js", fileString);
};
