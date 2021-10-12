import { Router } from "express";
import { projectInitializeHandler, projectSaveHandler } from "./api.handlers";

const apiRouter = Router();

apiRouter.post("/save-project", projectSaveHandler);
apiRouter.post("/initialize-project", projectInitializeHandler);

export default apiRouter;
