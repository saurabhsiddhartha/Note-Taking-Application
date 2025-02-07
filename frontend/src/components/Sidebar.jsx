import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import RecordNote from "./RecordNote";

const Sidebar = ({ isAuthenticated, setIsAuthenticated ,fetchNotes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRecord, setRecord] = useState(false);

  const handleLogin = () => setIsLoginOpen(true);
  const handleSignup = () => setIsSignupOpen(true);
  const handleRecordNote = () => setRecord(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <>
      <button className="md:hidden p-2 m-2 bg-red-600 text-white rounded-lg" onClick={() => setIsOpen(true)}>
        <Menu size={24} />
      </button>

      <div className={`fixed top-0 left-0 h-screen bg-red-600 p-4 w-60 flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 overflow-y-auto`}>

        <button className="absolute top-2 right-2 text-white md:hidden" onClick={() => setIsOpen(false)}>
          <X size={24} />
        </button>

        <h1 className="text-white text-2xl font-bold p-2 text-center">AI Note</h1>

        <div className="px-4 text-xl text-white space-y-3">
          <h1 className="cursor-pointer hover:text-gray-300">Home</h1>
          <h1 className="cursor-pointer hover:text-gray-300" onClick={handleRecordNote}>Add Notes</h1>
        </div>

        <div className="mt-auto flex flex-col gap-2">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="w-full p-3 text-xl text-white text-center rounded-lg shadow-xl cursor-pointer hover:bg-gray-700">
              Logout
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleLogin} className="w-full p-3 text-xl text-white text-center rounded-lg shadow-xl cursor-pointer hover:bg-gray-800">
                Login
              </button>
              <button onClick={handleSignup} className="w-full p-3 text-xl text-white text-center rounded-lg shadow-xl cursor-pointer hover:bg-gray-800">
                Signup
              </button>
            </div>
          )}
        </div>
      </div>

      {isRecord && <RecordNote setRecord={setRecord} fetchNotes={fetchNotes}/>}
      {isSignupOpen && <Signup setIsSignupOpen={setIsSignupOpen} setIsAuthenticated={setIsAuthenticated} />}
      {isLoginOpen && <Login setIsLoginOpen={setIsLoginOpen} setIsAuthenticated={setIsAuthenticated} />}
    </>
  );
};

export default Sidebar;
