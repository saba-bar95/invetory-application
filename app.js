import express from "express";
import path from "path";
import indexRouter from "./routes/indexRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import itemRouter from "./routes/itemRouter.js";
import PageNotFound from "./errors/pageNotFound.js";
import dotenv from "dotenv";

dotenv.config({ path: path.join(import.meta.dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 4000;
const __dirname = path.resolve();
const viewsPath = path.join(__dirname, "views");

app.set("views", viewsPath);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/categories", categoryRouter);
app.use("/items", itemRouter);

app.use((req, res, next) => {
  next(new PageNotFound(req.originalUrl));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).render("error", {
    message: err.message || "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
