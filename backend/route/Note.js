const express = require("express");
const multer = require("multer");
const Note = require("../model/NoteRecord");

const router = express.Router();
const storage = multer.memoryStorage(); // Stores files in memory
const upload = multer({ storage });

// Create a new note
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, text, audio } = req.body;
    let image = null;

    if (req.file) {
      image = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
        "base64"
      )}`;
    }

    const newNote = new Note({
      title,
      text,
      audio,
      image,
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("❌ Error saving note:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    console.error(" Error fetching notes:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id); 
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
