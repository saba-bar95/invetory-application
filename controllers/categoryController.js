import { body, validationResult } from "express-validator";
import * as db from "../db/queries.js";
import HttpError from "../errors/httpError.js";

const categoryValidators = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 100 })
    .withMessage("Name must be 100 characters or fewer."),
  body("description")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must be 1000 characters or fewer."),
];

export async function getHome(req, res, next) {
  try {
    const categories = await db.getAllCategories();
    res.render("index", { categories });
  } catch (err) {
    next(err);
  }
}

export async function getCategory(req, res, next) {
  try {
    const category = await db.getCategoryById(req.params.id);
    if (!category) {
      throw new HttpError("Category not found.", 404);
    }
    const items = await db.getItemsByCategoryId(category.id);
    res.render("categoryDetail", { category, items });
  } catch (err) {
    next(err);
  }
}

export function getNewCategoryForm(req, res) {
  res.render("categoryForm", {
    title: "New Category",
    action: "/categories",
    category: null,
    errors: [],
  });
}

export async function getEditCategoryForm(req, res, next) {
  try {
    const category = await db.getCategoryById(req.params.id);
    if (!category) {
      throw new HttpError("Category not found.", 404);
    }
    res.render("categoryForm", {
      title: "Edit Category",
      action: `/categories/${category.id}`,
      category,
      errors: [],
    });
  } catch (err) {
    next(err);
  }
}

export const createCategory = [
  ...categoryValidators,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("categoryForm", {
        title: "New Category",
        action: "/categories",
        category: req.body,
        errors: errors.array(),
      });
    }

    try {
      const category = await db.createCategory({
        name: req.body.name,
        description: req.body.description,
      });
      res.redirect(`/categories/${category.id}`);
    } catch (err) {
      if (err.code === "23505") {
        return res.status(400).render("categoryForm", {
          title: "New Category",
          action: "/categories",
          category: req.body,
          errors: [{ msg: "A category with that name already exists." }],
        });
      }
      next(err);
    }
  },
];

export const updateCategory = [
  ...categoryValidators,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("categoryForm", {
        title: "Edit Category",
        action: `/categories/${req.params.id}`,
        category: { id: req.params.id, ...req.body },
        errors: errors.array(),
      });
    }

    try {
      const category = await db.updateCategory(req.params.id, {
        name: req.body.name,
        description: req.body.description,
      });
      if (!category) {
        throw new HttpError("Category not found.", 404);
      }
      res.redirect(`/categories/${category.id}`);
    } catch (err) {
      if (err.code === "23505") {
        return res.status(400).render("categoryForm", {
          title: "Edit Category",
          action: `/categories/${req.params.id}`,
          category: { id: req.params.id, ...req.body },
          errors: [{ msg: "A category with that name already exists." }],
        });
      }
      next(err);
    }
  },
];

export async function deleteCategory(req, res, next) {
  try {
    const category = await db.getCategoryById(req.params.id);
    if (!category) {
      throw new HttpError("Category not found.", 404);
    }

    try {
      await db.deleteCategory(req.params.id);
    } catch (err) {
      // 23001 = restrict_violation, 23503 = foreign_key_violation
      if (err.code === "23001" || err.code === "23503") {
        throw new HttpError(
          `Cannot delete "${category.name}" while it still has items. Delete or move those items first.`,
          400,
        );
      }
      throw err;
    }

    res.redirect("/");
  } catch (err) {
    next(err);
  }
}
