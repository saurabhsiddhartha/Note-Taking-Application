const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String },
  audio: { type: String }, // URL of the recorded audio
  image: { type: String }, // URL of the uploaded image
  createdAt: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;
