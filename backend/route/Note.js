const express = require("express");
const multer = require("multer");
const Note = require("../model/NoteRecord");
// const {authMiddleware} = require('../middleware/middleware')

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.post("/notes/:id", upload.single("audio"), async (req, res) => {
  try {
    const { title, text } = req.body;
    const userId = req.params.id;

    let audio = null;
    if (req.file) {
      audio = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
        "base64"
      )}`;
    }

    const newNote = new Note({ title, text, audio, userId });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error saving note:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/notesdata/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const search = req.query.search;

    let query = { userId };

    if (search) {
      query.title = { $regex: new RegExp(search, "i") };
    }

    const notes = await Note.find(query);

    res.status(200).json(notes); // Return the notes
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/notesdata/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/notesdata/:id", upload.single("audio"), async (req, res) => {
  try {
    const { title, text } = req.body;
    const noteId = req.params.id;

    // Find the note by ID
    let note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Update the note's fields
    note.title = title || note.title;
    note.text = text || note.text;

    if (req.file) {
      note.audio = `data:audio/mpeg;base64,${req.file.buffer.toString(
        "base64"
      )}`;
    }
    const updatedNote = await note.save();
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
