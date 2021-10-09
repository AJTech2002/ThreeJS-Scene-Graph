import express, { Request, Response, Application, Express } from "express";
import {
  createFolderStructure,
  writeComponentsJS,
  writeDefaultComponents,
} from "./essentialFiles";

import { findJSFilesInFolder, isComponent } from "./utilities";

var cors = require("cors");

const app: Application = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

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

app.listen(PORT, (): void => {
  console.log(`Server Running here 👉 https://localhost:${PORT}`);
});
