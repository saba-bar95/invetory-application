import dotenv from "dotenv";
import pg from "pg";
import path from "path";

// Tell dotenv to look one level up (../) for the .env file
dotenv.config({ path: path.join(import.meta.dirname, "../.env") });

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env and add your Neon connection string.",
  );
}

export default new Pool({ connectionString });

