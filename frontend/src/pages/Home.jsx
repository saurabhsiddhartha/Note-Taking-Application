import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import NoteCard from "../components/NoteCard";
import axios from "axios";

const Home = ({ isAuthenticated, setIsAuthenticated }) => {
  const [notes, setNotes] = useState([]); 
  const fetchNotes = async () => {
    const userId = localStorage.getItem("userId");   
    if (!userId) return;
    try {
      const response = await axios.get(`http://localhost:5000/api/note/notesdata/${userId}`);
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      <Sidebar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <div className="flex flex-col p-4">
        <SearchBar />
        <div className="flex md:ml-60">
          <NoteCard fetchNotes={fetchNotes} />  
        </div>
      </div>
    </div>
  );
};

export default Home;
