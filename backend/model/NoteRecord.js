const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  text: {
    type: String,
  },
  image: {
    type: String, // Store image URL or file path
  },
  audio: {
    type: String,  
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
});

module.exports = mongoose.model("Note", NoteSchema);
