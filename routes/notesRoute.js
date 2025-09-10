import express from "express";
import {
  getNotesPage,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
  getNotes,
  getAllNotes,
} from "../controllers/notesController.js";

const router = express.Router();

router.get("/", getNotesPage);

router.get("/api", getNotes);
router.get("/api/all", getAllNotes);
router.post("/api", createNote);
router.put("/api/:id", updateNote);
router.delete("/api/:id", deleteNote);
router.get("/api/search", searchNotes);

export default router;
