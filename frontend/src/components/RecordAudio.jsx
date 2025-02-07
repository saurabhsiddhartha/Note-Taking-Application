import React, { useState, useEffect } from "react";

const RecordAudio = ({ onStop }) => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  useEffect(() => {
    let mediaRecorder;
    let audioChunks = [];

    const startRecording = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: "audio/mpeg" });
        setAudioBlob(blob);
        onStop(blob);   
      };

      mediaRecorder.start();
    };

    if (recording) {
      startRecording();
    } else {
      mediaRecorder?.stop();
    }

    return () => mediaRecorder?.stream.getTracks().forEach((track) => track.stop());
  }, [recording, onStop]);

  return (
    <div>
      <button
        onClick={() => setRecording((prev) => !prev)}
        className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
      >
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      {audioBlob && (
        <audio controls>
          <source src={URL.createObjectURL(audioBlob)} type="audio/mpeg" />
        </audio>
      )}
    </div>
  );
};

export default RecordAudio;
