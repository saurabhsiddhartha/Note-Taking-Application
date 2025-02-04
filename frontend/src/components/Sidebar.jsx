import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // Importing icons

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 m-2 bg-red-600 text-white rounded-lg"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-red-600 p-4 w-60 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Close Button (Only for mobile) */}
        <button
          className="absolute top-2 right-2 text-white md:hidden"
          onClick={() => setIsOpen(false)}
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <h1 className="text-white text-2xl font-bold p-2 text-center">AI Note</h1>

        {/* Menu Items */}
        <div className="px-4 text-xl text-white space-y-3">
          <h1 className="cursor-pointer hover:text-gray-300">Home</h1>
          <h1 className="cursor-pointer hover:text-gray-300">Favourite</h1>
        </div>

        {/* Signup Button (Pinned to Bottom) */}
        <div className="mt-auto">
          <div className="bg-black w-full p-3 text-xl text-white text-center rounded-lg shadow-xl cursor-pointer hover:bg-gray-800">
            Signup
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
