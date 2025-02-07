import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Mic, X } from "lucide-react";
import { jwtDecode } from "jwt-decode";

const RecordNote = ({ setRecord,fetchNotes }) => {
  const [note, setNote] = useState({ title: "", text: "", audio: null });
  const [isRecording, setIsRecording] = useState(false);
  const [notes, setNotes] = useState([]);  // Initialize notes state
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleChange = (e) => setNote({ ...note, [e.target.name]: e.target.value });

  const handleStartRecording = async () => {
    setIsRecording(true);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mpeg" });
        const audioFile = new File([audioBlob], "recording.mp3", { type: "audio/mpeg" });

        setNote((prev) => ({ ...prev, audio: audioFile }));
      };

      mediaRecorderRef.current.start();

      setTimeout(() => {
        if (mediaRecorderRef.current.state === "recording") handleStopRecording();
      }, 60000);  // Automatically stop recording after 60 seconds
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const getUserId = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.userId;   
    }
    return null;
  };

  const handleAddNote = async () => {
    const userId = getUserId();
    if (!userId) {
      alert("Login first");
      return;
    }

    const formData = new FormData();
    formData.append("title", note.title);
    formData.append("text", note.text);
    formData.append("audio", note.audio);
    formData.append("userId", userId);

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/note/notes/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Note Saved");
      setRecord(false);
      setNote({ title: "", text: "", audio: null });   
      console.log(fetchNotes(),"fetch funtion call") 
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };



  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <button className="absolute top-2 right-2 text-gray-600 hover:text-black" onClick={() => setRecord(false)}>
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">New Note</h2>

        <input
          type="text"
          name="title"
          placeholder="Enter title"
          value={note.title}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg mb-3"
        />
        <textarea
          name="text"
          placeholder="Write your note..."
          value={note.text}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg mb-3 h-28"
        />

        <div className="flex justify-between mb-3">
          {isRecording ? (
            <button onClick={handleStopRecording} className="px-4 py-2 bg-red-700 text-white rounded-lg">
              <Mic size={18} className="mr-2" /> Stop
            </button>
          ) : (
            <button onClick={handleStartRecording} className="px-4 py-2 bg-red-500 text-white rounded-lg">
              <Mic size={18} className="mr-2" /> Record
            </button>
          )}
        </div>

        {note.audio && (
          <audio controls className="w-full mt-3">
            <source src={URL.createObjectURL(note.audio)} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}

        <button onClick={handleAddNote} className="w-full bg-green-500 text-white py-2 cursor-pointer rounded-lg">
          Add Note
        </button>
      </div>
    </div>
  );
};

export default RecordNote;
