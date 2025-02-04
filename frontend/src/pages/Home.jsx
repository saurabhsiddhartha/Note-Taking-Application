import React from "react";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import NoteCard from "../components/NoteCard";

const Home = () => {
  // Dummy Note Data (Replace with real data)
  const notes = [
    { id: 1, title: "Meeting Notes", text: "Discuss project updates..." },
    { id: 2, title: "Shopping List", text: "Buy milk, eggs, bread..." },
    { id: 3, title: "Workout Plan", text: "Monday - Cardio, Tuesday - Strength..." },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar (Left) */}
      <div className="w-60 bg-gray-800">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4">
        {/* Top Section: Search Bar */}
        <div className="flex justify-end">
          <SearchBar />
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {notes.map((note) => (
            <NoteCard key={note.id} title={note.title} text={note.text} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
