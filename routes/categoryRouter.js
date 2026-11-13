import { Router } from "express";
import * as categoryController from "../controllers/categoryController.js";
import validateId from "../middleware/validateId.js";

const categoryRouter = Router();

categoryRouter.get("/new", categoryController.getNewCategoryForm);
categoryRouter.post("/", categoryController.createCategory);
categoryRouter.get("/:id/edit", validateId, categoryController.getEditCategoryForm);
categoryRouter.post("/:id/delete", validateId, categoryController.deleteCategory);
categoryRouter.get("/:id", validateId, categoryController.getCategory);
categoryRouter.post("/:id", validateId, categoryController.updateCategory);

export default categoryRouter;
