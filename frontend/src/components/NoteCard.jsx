import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { X, Trash, Pencil } from "lucide-react";

const NoteCard = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decoded = jwtDecode(token); // Decode token
      return decoded.userId; // Adjust based on your token payload structure
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      const userId = getUserIdFromToken();
      console.log(userId, "this is user id");

      if (!userId) {
        console.error("No userId found! User may not be logged in.");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/note/notesdata/${userId}`);
        console.log("Fetched Notes:", response.data);
        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/note/notesdata/${id}`);
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));

      alert("Note Deleted");
      setSelectedNote(null);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleEdit = (note) => {
    // Logic to handle editing the note
    console.log("Editing note:", note);
    // For now, you can log or trigger an action like opening a form to edit.
  };

  return (
    <div className="flex flex-wrap gap-4">
      {notes.length === 0 ? (
        <p className="w-full text-center text-gray-500">No notes available.</p>
      ) : (
        notes.map((note) => (
          <div
            key={note._id}
            className="w-60 h-auto bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setSelectedNote(note)}
          >
            <h1 className="text-lg font-semibold text-gray-800">{note.title}</h1>
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{note.text}</p>

            <p className="text-gray-500 text-xs mt-2">
              {new Date(note.createdAt).toLocaleString()}
            </p>

            {/* Display Image */}
            {note.image && (
              <img
                src={note.image}
                alt="Note"
                className="w-full h-20 object-cover mt-2 rounded-lg"
              />
            )}

            {/* Display Audio Player (Compact) */}
            {note.audio && (
              <audio controls className="w-full mt-2">
                <source src={note.audio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        ))
      )}

      {selectedNote && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => setSelectedNote(null)}
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800">{selectedNote.title}</h2>
            <p className="text-gray-600 mt-2">{selectedNote.text}</p>

            <p className="text-gray-500 text-xs mt-2">
              {new Date(selectedNote.createdAt).toLocaleString()}
            </p>

            {/* Display Full Image */}
            {selectedNote.image && (
              <img
                src={selectedNote.image}
                alt="Note"
                className="w-full h-40 object-cover mt-3 rounded-lg"
              />
            )}

            {/* Display Full Audio Player */}
            {selectedNote.audio && (
              <audio controls className="w-full mt-3">
                <source src={selectedNote.audio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}

            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEdit(selectedNote)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center hover:bg-blue-600"
              >
                <Pencil size={16} className="mr-2" /> Edit
              </button>
              <button
                onClick={() => handleDelete(selectedNote._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center hover:bg-red-600"
              >
                <Trash size={16} className="mr-2" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteCard;
