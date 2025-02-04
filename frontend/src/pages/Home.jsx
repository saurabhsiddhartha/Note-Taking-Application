import React from "react";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import NoteCard from "../components/NoteCard";

const Home = () => {
  return (
    <div>
      <Sidebar />
      <div className="flex-1 flex flex-col p-4">
        <SearchBar />
        <div className="flex md:ml-60">
          <NoteCard /> 
        </div>
      </div>
    </div>
  );
};

export default Home;
