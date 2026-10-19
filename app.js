import express from "express";
import path from "path";
import indexRouter from "./routes/indexRouter.js";
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

// Catch unknown routes and forward to the error handler
app.use((req, res, next) => {
  next(new PageNotFound(req.originalUrl));
});

// Must have 4 args — Express treats this as the error handler
// Express Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // If it's a validation error, you can re-render the form with error feedback
  //   if (err.name === "ValidationError") {
  //     return res.status(statusCode).render("form", {
  //       errors: err.errors,
  //       oldInput: req.body, // Keeps what the user typed so they don't lose it
  //     });
  //   }

  res.status(statusCode).render("error", {
    message: err.message || "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
