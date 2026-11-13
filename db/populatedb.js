#! /usr/bin/env node
import path from "path";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: path.join(import.meta.dirname, "../.env") });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "DATABASE_URL is not set. Copy .env.example to .env and add your Neon connection string.",
  );
  process.exit(1);
}

const SQL = `
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE items (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO categories (name, description) VALUES
  ('Electronics', 'Phones, laptops, and other gadgets'),
  ('Office Supplies', 'Desk essentials and stationery'),
  ('Furniture', 'Chairs, desks, and storage');

INSERT INTO items (name, description, quantity, price, category_id) VALUES
  ('Wireless Mouse', 'Ergonomic USB mouse', 40, 24.99, 1),
  ('USB-C Hub', '7-in-1 multiport adapter', 18, 49.50, 1),
  ('Notebook Pack', 'Pack of 3 lined notebooks', 120, 9.99, 2),
  ('Ballpoint Pens', 'Box of 20 black pens', 85, 6.49, 2),
  ('Standing Desk', 'Height-adjustable desk', 8, 299.00, 3),
  ('Office Chair', 'Mesh back swivel chair', 15, 179.00, 3);
`;

async function main() {
  console.log("Seeding database...");
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
