import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const SearchBar = ({ setNotes }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState(null);
 
  useEffect(() => {
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

    setUserId(getUserIdFromToken());
  }, []);

  useEffect(() => {
    if (!userId) return;  
    const fetchNotes = async () => {
      try {
        let url = `${import.meta.env.VITE_SERVER_URL}/api/note/notesdata/${userId}`;
        if (searchTerm) {
          url += `?search=${encodeURIComponent(searchTerm)}`;
        } 
        const response = await axios.get(url);
        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    const delayDebounce = setTimeout(fetchNotes, 500);  

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, userId]);  
  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex w-full max-w-lg border border-gray-400 rounded-lg overflow-hidden">
        <input
          type="text"
          placeholder="Type to search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 outline-none text-gray-700"
        />
      </div>
    </div>
  );
};

export default SearchBar;



  