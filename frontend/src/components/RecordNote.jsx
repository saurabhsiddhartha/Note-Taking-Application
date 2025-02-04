import React, { useState, useRef } from "react";
import axios from "axios";
import { Mic, Image, X } from "lucide-react";

const RecordNote = ({ setRecord }) => {
  const [note, setNote] = useState({
    title: "",
    text: "",
    audio: null,
    image: null,
  });

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Function to handle text input changes
  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  // Function to handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setNote({ ...note, image: file });
  };

  // Start recording audio
  const handleStartRecording = async () => {
    setIsRecording(true);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mpeg" });
        const audioFile = new File([audioBlob], "recording.mp3", { type: "audio/mpeg" });
        setNote((prev) => ({ ...prev, audio: audioFile }));

        // Convert speech to text
        handleSpeechToText(audioBlob);
      };

      mediaRecorderRef.current.start();

      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          handleStopRecording();
        }
      }, 60000); // Automatically stop after 1 minute

    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  // Stop recording audio
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // Transcribe audio to text using Web Speech API
  const handleSpeechToText = (audioBlob) => {
    const recognition = new window.webkitSpeechRecognition() || new window.SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNote((prev) => ({ ...prev, text: transcript }));
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
  };

  // Function to submit the note
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", note.title);
    formData.append("text", note.text);
    if (note.audio) formData.append("audio", note.audio);
    if (note.image instanceof File) formData.append("image", note.image);

    try {
      await axios.post("http://localhost:5000/api/notes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Note Saved Successfully!");
      setRecord(false);
    } catch (error) {
      console.error("Error saving note:", error.response?.data || error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          onClick={() => setRecord(false)}
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          New Note
        </h2>

        {/* Title Input */}
        <input
          type="text"
          name="title"
          placeholder="Enter title"
          value={note.title}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-400"
        />

        {/* Textarea Input */}
        <textarea
          name="text"
          placeholder="Write your note..."
          value={note.text}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg mb-3 h-28 focus:ring-2 focus:ring-blue-400"
        />

        {/* Audio & Image Buttons */}
        <div className="flex justify-between mb-3">
          {isRecording ? (
            <button
              onClick={handleStopRecording}
              className="flex items-center px-4 py-2 bg-red-700 text-white rounded-lg shadow-md hover:bg-red-800"
            >
              <Mic size={18} className="mr-2" /> Stop Recording
            </button>
          ) : (
            <button
              onClick={handleStartRecording}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600"
            >
              <Mic size={18} className="mr-2" /> Start Recording
            </button>
          )}

          <label className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md cursor-pointer hover:bg-blue-600">
            <Image size={18} className="mr-2" />
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Display Uploaded Image */}
        {note.image && (
          <img
            src={URL.createObjectURL(note.image)}
            alt="Uploaded"
            className="w-full h-32 object-cover mb-3 rounded-lg"
          />
        )}

        {/* Display Recorded Audio */}
        {note.audio && (
          <audio controls className="w-full mt-3">
            <source src={URL.createObjectURL(note.audio)} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}

        {/* Add Note Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-all"
        >
          Add Note
        </button>
      </div>
    </div>
  );
};

export default RecordNote;
