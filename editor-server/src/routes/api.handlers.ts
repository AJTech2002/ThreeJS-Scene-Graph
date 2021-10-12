import { Handler } from "express";
import {
  createFolderStructure,
  writeComponentsJS,
  writeDefaultComponents,
  writeFileInFolder,
} from "../essentialFiles";
import { findJSFilesInFolder, isComponent } from "../utilities";

export const projectSaveHandler: Handler = (req, res) => {
  let data: any = req.body;
  let location = data.directory;
  let scene = data.data;

  writeFileInFolder(location + "/src/scene-parsed", "scene.json", scene, true);
};

export const projectInitializeHandler: Handler = (req, res) => {
  let data: any = req.body;
  let location: string | undefined = data?.project?.directory;

  let allJSFiles = [];

  createFolderStructure(location + "/src", "scene-parsed");

  writeDefaultComponents(location + "/src/scene-parsed/defaultComponents");

  if (location) {
    let files = findJSFilesInFolder(location + "/src");
    let components: string[] = [];
    files.forEach((file) => {
      if (isComponent(file)) components.push(file);
    });

    writeComponentsJS(
      location + "/src/scene-parsed",
      components,
      location + "/src"
    );
  }

  res.send("Done.");
};
