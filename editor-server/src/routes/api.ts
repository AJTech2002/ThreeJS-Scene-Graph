import { Router } from "express";
import {
    projectInitializeHandler,
    projectSaveHandler,
    getComponentJSON,
    getSceneJSON
} from "./api.handlers";

const apiRouter = Router();

apiRouter.post("/save-project", projectSaveHandler);
apiRouter.post("/initialize-project", projectInitializeHandler);

apiRouter.get("/scene-json", getSceneJSON);
apiRouter.get("/component-json", getComponentJSON);

export default apiRouter;