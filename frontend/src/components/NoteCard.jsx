import React, { useState } from "react";
import axios from "axios";
import { X, Trash, Pencil, Mic } from "lucide-react";
import RecordAudio from "./RecordAudio";  

const NoteCard = ({ notes, setNotes }) => {
  const [selectedNote, setSelectedNote] = useState(null);
  const [editedNote, setEditedNote] = useState(null); // State to track edits
  const [isEditing, setIsEditing] = useState(false); // State to toggle between view and edit mode
  const [audioFile, setAudioFile] = useState(null); // State to store new audio file for re-recording
  const [isRecording, setIsRecording] = useState(false); // To track if recording is in progress

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/note/notesdata/${id}`
      );
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
      alert("Note Deleted");
      setSelectedNote(null);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleEdit = (note) => {
    setSelectedNote(note);
    setEditedNote(note);  
    setIsEditing(true);  
  };

const handleSaveEdit = async () => {
  try {
    const formData = new FormData();
    formData.append("title", editedNote.title);
    formData.append("text", editedNote.text);

    if (audioFile) {
      formData.append("audio", audioFile);
    }
    console.log(...formData)
    const response = await axios.put(
      `${import.meta.env.VITE_SERVER_URL}/api/note/notesdata/${editedNote._id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (response.status === 200 && response.data) {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === editedNote._id ? { ...note, ...response.data } : note
        )
      );
      alert("Note Updated Successfully");  
      setIsEditing(false);
      setSelectedNote(null);
    } else {
      alert("Edit Unsuccessful! Please try again.");
    }
  } catch (error) {
    console.error("Error saving edited note:", error);
    alert("Failed to update note. Please check your connection and try again.");
  }
};


  const handleCancelEdit = () => {
    setIsEditing(false); 
    setEditedNote(null); 
    setAudioFile(null); 
  };

  const handleReRecordAudio = () => {
    setIsRecording(true);  
  };

  const handleAudioRecorded = (audioBlob) => {
    setAudioFile(audioBlob); 
    setIsRecording(false); 
  };

  return (
    <div className="flex flex-wrap gap-4 relative">
      {notes.length === 0 ? (
        <p className="w-full text-center text-gray-500">No notes available.</p>
      ) : (
        notes.map((note) => (
          <div
            key={note._id}
            className="w-60 h-auto bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setSelectedNote(note)}
          >
            <h1 className="text-lg font-semibold text-gray-800">
              {note.title}
            </h1>
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
              {note.text}
            </p>
            <p className="text-gray-500 text-xs mt-2">
              {new Date(note.createdAt).toLocaleString()}
            </p>

            {note.image && (
              <img
                src={note.image}
                alt="Note"
                className="w-full h-20 object-cover mt-2 rounded-lg"
              />
            )}

            {!selectedNote && note.audio && (
              <audio controls className="w-full mt-2">
                <source src={note.audio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        ))
      )}

      {selectedNote && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => {
                setSelectedNote(null);
                handleCancelEdit();
              }}
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800">
              {selectedNote.title}
            </h2>
            <p className="text-gray-600 mt-2">{selectedNote.text}</p>
            <p className="text-gray-500 text-xs mt-2">
              {new Date(selectedNote.createdAt).toLocaleString()}
            </p>

            {selectedNote.image && (
              <img
                src={selectedNote.image}
                alt="Note"
                className="w-full h-40 object-cover mt-3 rounded-lg"
              />
            )}

            {selectedNote.audio && (
              <audio controls className="w-full mt-3 z-10">
                <source src={selectedNote.audio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}

            <div className="flex justify-between mt-4">
              {isEditing ? (
                <div className="flex flex-col w-full gap-3">
                  <input
                    type="text"
                    value={editedNote.title}
                    onChange={(e) =>
                      setEditedNote({ ...editedNote, title: e.target.value })
                    }
                    className="p-2 border rounded-lg"
                    placeholder="Edit Title"
                  />
                  <textarea
                    value={editedNote.text}
                    onChange={(e) =>
                      setEditedNote({ ...editedNote, text: e.target.value })
                    }
                    className="p-2 border rounded-lg"
                    placeholder="Edit Text"
                  />
                  <div className="flex gap-2">
                    {!audioFile && selectedNote.audio && (
                      <button
                        onClick={handleReRecordAudio}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg flex items-center hover:bg-yellow-600"
                      >
                        <Mic size={16} className="mr-2" /> Re-record Audio
                      </button>
                    )}

                    {isRecording ? (
                      <RecordAudio onStop={handleAudioRecorded} /> 
                    ) : null}

                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center hover:bg-blue-600"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteCard;
