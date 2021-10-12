import express, { Application, Request, Response } from "express";
import { readFileSync } from "fs";
import apiRouter from "./routes/api";

var cors = require("cors");

const app: Application = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api", apiRouter);

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
