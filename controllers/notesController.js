import Notes from "../models/notesModel.js";

export const getNotesPage = async (req, res) => {
  try {
    const noteData = await Notes.find().sort({
      creationDate: -1,
    });

    res.status(200).render("index", { title: "My Note Keeper", noteData });
  } catch (error) {
    res.status(500).send("Error loading notes page");
  }
};

export const getNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalNotes = await Notes.countDocuments();
    const pageNotes = await Notes.find()
      .sort({ creationDate: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ page, limit, totalNotes, pageNotes });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch notes", error: error.message });
  }
};

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const newNote = new Notes({
      title: title,
      content: content,
    });

    await newNote.save();

    res
      .status(201)
      .json({ message: "Note created successfully", note: newNote });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create note", error: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const updatedNote = await Notes.findByIdAndUpdate(
      id,
      {
        title,
        content,
      },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note updated successfully", note: updatedNote });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update note", error: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);

    const deletedNote = await Notes.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete note", error: error.message });
  }
};

export const searchNotes = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const notes = await Notes.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    });

    res.json(notes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to search notes", error: error.message });
  }
};
