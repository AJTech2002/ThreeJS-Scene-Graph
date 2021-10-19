import express, { Application } from "express";
import apiRouter from "./routes/api";

var cors = require("cors");

const app: Application = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api", apiRouter);

app.listen(PORT, (): void => {
  console.log(`Server Running here https://localhost:${PORT}`);
});
