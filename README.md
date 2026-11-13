# Inventory Application

A simple inventory web app built as part of [The Odin Project](https://www.theodinproject.com/) — NodeJS course.

Browse categories, inspect items, and create, update, or delete either from the browser. Data lives in Neon (Postgres).

## Features

- List all categories on the home page
- View a category and every item inside it
- View a single item (quantity, price, category)
- Full CRUD for categories and items
- Form validation with `express-validator`
- Category delete is **restricted** while the category still has items (delete or reassign items first)
- Seed script with sample data

## Tech stack

- **Node.js** + **Express 5**
- **EJS** templates
- **PostgreSQL** via **Neon** (`pg` Pool)
- **express-validator**
- **Pico CSS** + custom styles
- **dotenv** for configuration

## Getting started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd invetory-application
npm install
```

### 2. Environment variables

Copy the example env file and fill in your Neon connection string:

```bash
cp .env.example .env
```

| Variable       | Description                                      |
| -------------- | ------------------------------------------------ |
| `PORT`         | Server port (default `4000`)                     |
| `DATABASE_URL` | Neon Postgres connection string (`sslmode=require`) |

Create a free database at [neon.tech](https://neon.tech) if you do not have one yet.

### 3. Create tables and seed data

```bash
npm run populate
```

This drops and recreates `categories` / `items`, then inserts sample rows.  
**Warning:** it wipes existing inventory data in that database.

### 4. Start the server

```bash
npm start
```

Open [http://localhost:4000](http://localhost:4000).

## How to use

1. **Home** — see all categories; create a new category or item
2. **Category** — see items in that category; edit/delete the category or add items
3. **Item** — see details; edit or delete the item
4. Deleting a category that still has items shows an error until those items are removed

## Project structure

```
app.js                 # Express app entry
controllers/           # Category & item request handlers
db/
  pool.js              # Postgres pool (Neon)
  queries.js           # SQL helpers
  populatedb.js        # Schema + seed script
errors/                # Custom HTTP / 404 errors
middleware/            # Shared middleware (e.g. id validation)
routes/                # Express routers
views/                 # EJS templates + partials
public/styles/         # Custom CSS
.env.example           # Env template (safe to commit)
```

## Scripts

| Command           | What it does                          |
| ----------------- | ------------------------------------- |
| `npm start`       | Run the app (`node app.js`)           |
| `npm run populate`| Reset schema and insert dummy data    |

## Database notes

- One **category** has many **items**; each **item** belongs to one **category**
- Foreign key: `items.category_id → categories.id` with `ON DELETE RESTRICT`
- Useful fields: category `name` (unique), item `quantity` / `price` (non-negative)

## License

Personal / educational project for The Odin Project.
