import { body, validationResult } from "express-validator";
import * as db from "../db/queries.js";
import HttpError from "../errors/httpError.js";

const itemValidators = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 150 })
    .withMessage("Name must be 150 characters or fewer."),
  body("description")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must be 1000 characters or fewer."),
  body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Quantity is required.")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a whole number of 0 or more."),
  body("price")
    .trim()
    .notEmpty()
    .withMessage("Price is required.")
    .isFloat({ min: 0 })
    .withMessage("Price must be a number of 0 or more."),
  body("category_id")
    .trim()
    .notEmpty()
    .withMessage("Category is required.")
    .isInt({ min: 1 })
    .withMessage("Choose a valid category."),
];

async function renderItemForm(res, status, { title, action, item, errors }) {
  const categories = await db.getAllCategories();
  return res.status(status).render("itemForm", {
    title,
    action,
    item,
    categories,
    errors,
  });
}

export async function getItem(req, res, next) {
  try {
    const item = await db.getItemById(req.params.id);
    if (!item) {
      throw new HttpError("Item not found.", 404);
    }
    res.render("itemDetail", { item });
  } catch (err) {
    next(err);
  }
}

export async function getNewItemForm(req, res, next) {
  try {
    await renderItemForm(res, 200, {
      title: "New Item",
      action: "/items",
      item: {
        name: "",
        description: "",
        quantity: 0,
        price: "0.00",
        category_id: req.query.category_id || "",
      },
      errors: [],
    });
  } catch (err) {
    next(err);
  }
}

export async function getEditItemForm(req, res, next) {
  try {
    const item = await db.getItemById(req.params.id);
    if (!item) {
      throw new HttpError("Item not found.", 404);
    }
    await renderItemForm(res, 200, {
      title: "Edit Item",
      action: `/items/${item.id}`,
      item,
      errors: [],
    });
  } catch (err) {
    next(err);
  }
}

export const createItem = [
  ...itemValidators,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      try {
        return await renderItemForm(res, 400, {
          title: "New Item",
          action: "/items",
          item: req.body,
          errors: errors.array(),
        });
      } catch (err) {
        return next(err);
      }
    }

    try {
      const category = await db.getCategoryById(req.body.category_id);
      if (!category) {
        return await renderItemForm(res, 400, {
          title: "New Item",
          action: "/items",
          item: req.body,
          errors: [{ msg: "Choose a valid category." }],
        });
      }

      const item = await db.createItem({
        name: req.body.name,
        description: req.body.description,
        quantity: Number(req.body.quantity),
        price: Number(req.body.price),
        category_id: Number(req.body.category_id),
      });
      res.redirect(`/items/${item.id}`);
    } catch (err) {
      next(err);
    }
  },
];

export const updateItem = [
  ...itemValidators,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      try {
        return await renderItemForm(res, 400, {
          title: "Edit Item",
          action: `/items/${req.params.id}`,
          item: { id: req.params.id, ...req.body },
          errors: errors.array(),
        });
      } catch (err) {
        return next(err);
      }
    }

    try {
      const category = await db.getCategoryById(req.body.category_id);
      if (!category) {
        return await renderItemForm(res, 400, {
          title: "Edit Item",
          action: `/items/${req.params.id}`,
          item: { id: req.params.id, ...req.body },
          errors: [{ msg: "Choose a valid category." }],
        });
      }

      const item = await db.updateItem(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        quantity: Number(req.body.quantity),
        price: Number(req.body.price),
        category_id: Number(req.body.category_id),
      });
      if (!item) {
        throw new HttpError("Item not found.", 404);
      }
      res.redirect(`/items/${item.id}`);
    } catch (err) {
      next(err);
    }
  },
];

export async function deleteItem(req, res, next) {
  try {
    const deleted = await db.deleteItem(req.params.id);
    if (!deleted) {
      throw new HttpError("Item not found.", 404);
    }
    res.redirect(`/categories/${deleted.category_id}`);
  } catch (err) {
    next(err);
  }
}
