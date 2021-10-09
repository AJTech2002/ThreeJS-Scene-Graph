import express, { Request, Response, Application, Express } from "express";

var cors = require("cors");

const app: Application = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

app.get("/api", (req: Request, res: Response): void => {
  res.send("Hello Typescript withs Node.js!");
});

app.listen(PORT, (): void => {
  console.log(`Server Running here 👉 https://localhost:${PORT}`);
});
