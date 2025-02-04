import React from "react";

const SearchBar = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex w-full max-w-lg border border-gray-400 rounded-lg overflow-hidden">
        <input
          type="text"
          placeholder="Type to search..."
          className="w-screen p-2 outline-none text-gray-700"
        />
        <button className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700">
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
