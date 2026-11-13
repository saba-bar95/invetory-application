import { Router } from "express";
import * as categoryController from "../controllers/categoryController.js";

const indexRouter = Router();

indexRouter.get("/", categoryController.getHome);

export default indexRouter;
