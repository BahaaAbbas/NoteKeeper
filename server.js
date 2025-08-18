import express from "express";
import dotenv from "@dotenvx/dotenvx";
import connectMDB from "./db.js";

dotenv.config();

const app = express();

connectMDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("views", "./views");
app.set("view engine", "ejs");

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server started at Port ${PORT}`);
});
