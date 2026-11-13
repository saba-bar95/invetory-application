import pool from "./pool.js";

export async function getAllCategories() {
  const { rows } = await pool.query(
    `SELECT c.*, COUNT(i.id)::int AS item_count
     FROM categories c
     LEFT JOIN items i ON i.category_id = c.id
     GROUP BY c.id
     ORDER BY c.name ASC`,
  );
  return rows;
}

export async function getCategoryById(id) {
  const { rows } = await pool.query(
    `SELECT * FROM categories WHERE id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function getItemsByCategoryId(categoryId) {
  const { rows } = await pool.query(
    `SELECT * FROM items WHERE category_id = $1 ORDER BY name ASC`,
    [categoryId],
  );
  return rows;
}

export async function createCategory({ name, description }) {
  const { rows } = await pool.query(
    `INSERT INTO categories (name, description)
     VALUES ($1, $2)
     RETURNING *`,
    [name, description || null],
  );
  return rows[0];
}

export async function updateCategory(id, { name, description }) {
  const { rows } = await pool.query(
    `UPDATE categories
     SET name = $1, description = $2
     WHERE id = $3
     RETURNING *`,
    [name, description || null, id],
  );
  return rows[0] ?? null;
}

export async function deleteCategory(id) {
  const { rowCount } = await pool.query(
    `DELETE FROM categories WHERE id = $1`,
    [id],
  );
  return rowCount > 0;
}

export async function getItemById(id) {
  const { rows } = await pool.query(
    `SELECT i.*, c.name AS category_name
     FROM items i
     JOIN categories c ON c.id = i.category_id
     WHERE i.id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function createItem({
  name,
  description,
  quantity,
  price,
  category_id,
}) {
  const { rows } = await pool.query(
    `INSERT INTO items (name, description, quantity, price, category_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, description || null, quantity, price, category_id],
  );
  return rows[0];
}

export async function updateItem(
  id,
  { name, description, quantity, price, category_id },
) {
  const { rows } = await pool.query(
    `UPDATE items
     SET name = $1,
         description = $2,
         quantity = $3,
         price = $4,
         category_id = $5
     WHERE id = $6
     RETURNING *`,
    [name, description || null, quantity, price, category_id, id],
  );
  return rows[0] ?? null;
}

export async function deleteItem(id) {
  const { rows } = await pool.query(
    `DELETE FROM items WHERE id = $1 RETURNING *`,
    [id],
  );
  return rows[0] ?? null;
}
