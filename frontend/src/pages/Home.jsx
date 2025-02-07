import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import NoteCard from "../components/NoteCard";
import { jwtDecode } from "jwt-decode";
import axios from "axios";


const Home = ({ isAuthenticated, setIsAuthenticated }) => {
  const [notes, setNotes] = useState([]); 

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
  
    try {
      const decoded = jwtDecode(token);
      return decoded.userId;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  const fetchNotes = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/note/notesdata/${userId}`); 
      setNotes(response.data);
      console.log(notes, "All these notes come from the home page");
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      <Sidebar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} fetchNotes={fetchNotes}/>
      <div className="flex flex-col p-4">
        <SearchBar />
        <div className="flex md:ml-60">
          {/* ✅ Pass notes and setNotes as props */}
          <NoteCard notes={notes} setNotes={setNotes} />  
        </div>
      </div>
    </div>
  );
};

export default Home;
