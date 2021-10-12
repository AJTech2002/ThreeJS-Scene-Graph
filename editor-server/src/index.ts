import express, { Request, Response, Application, Express } from "express";
import { readFileSync } from "fs";
import {
  createFolderStructure,
  writeComponentsJS,
  writeDefaultComponents,
  writeFileInFolder,
} from "./essentialFiles";

import { findJSFilesInFolder, isComponent } from "./utilities";

var cors = require("cors");

const app: Application = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/api/save-project", (req: Request, res: Response): void => {
  let data: any = req.body;
  let location = data.directory;
  let scene = data.data;

  writeFileInFolder(location + "/src/scene-parsed", "scene.json", scene, true);
});

app.post("/api/initialize-project", (req: Request, res: Response): void => {
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
});

app.get("/sceneJSON", (req: Request, res: Response): void => {
  let json = readFileSync(req.query.root + "/src/scene-parsed/scene.json");
  res.send(json.toString());
});

app.get("/componentJSON", (req: Request, res: Response): void => {
  let json = readFileSync(
    req.query.root +
      `/src/scene-parsed/component-props/${req.query.component}.props.json`
  );
  res.send(json.toString());
});

app.listen(PORT, (): void => {
  console.log(`Server Running here 👉 https://localhost:${PORT}`);
});
