import express from "express";
import { getNotesPage } from "../controllers/notesController.js";

const router = express.Router();

router.get("/", getNotesPage);

export default router;
