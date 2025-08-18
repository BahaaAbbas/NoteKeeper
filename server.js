import express from "express";
import dotenv from "@dotenvx/dotenvx";
import connectMDB from "./db.js";
import notesRouter from "./routes/notesRoute.js";

dotenv.config();

const app = express();

connectMDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("views", "./views");
app.set("view engine", "ejs");

app.use("/notes", notesRouter);

app.get("/", (req, res) => {
  res.redirect("/notes");
});

app.use((req, res, next) => {
  res
    .status(404)
    .render("notfound", { title: "Page Not Found", path: req.originalUrl });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server started at Port ${PORT}`);
});
