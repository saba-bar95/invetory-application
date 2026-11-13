import { Router } from "express";
import * as itemController from "../controllers/itemController.js";
import validateId from "../middleware/validateId.js";

const itemRouter = Router();

itemRouter.get("/new", itemController.getNewItemForm);
itemRouter.post("/", itemController.createItem);
itemRouter.get("/:id/edit", validateId, itemController.getEditItemForm);
itemRouter.post("/:id/delete", validateId, itemController.deleteItem);
itemRouter.get("/:id", validateId, itemController.getItem);
itemRouter.post("/:id", validateId, itemController.updateItem);

export default itemRouter;
