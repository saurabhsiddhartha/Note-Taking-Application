import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Signup from "../pages/Signup";
import Login from "../pages/Login";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login state

  const handleLogin = () => {
    setIsLoginOpen(true);
  };

  const handleSignup = () => {
    setIsSignupOpen(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

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

        {/* Signup/Login/Logout Button */}
        <div className="mt-auto">
          {isAuthenticated ? (
            <div
              onClick={handleLogout}
              className="bg-black w-full p-3 text-xl text-white text-center rounded-lg shadow-xl cursor-pointer hover:bg-gray-800"
            >
              Logout
            </div>
          ) : (
            <div className="flex gap-2">
              <div
                onClick={handleLogin}
                className="bg-black w-full p-3 text-xl text-white text-center rounded-lg shadow-xl cursor-pointer hover:bg-gray-800"
              >
                Login
              </div>
              <div
                onClick={handleSignup}
                className="bg-black w-full p-3 text-xl text-white text-center rounded-lg shadow-xl cursor-pointer hover:bg-gray-800"
              >
                Signup
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Conditional Render of Modals */}
      {isSignupOpen && <Signup setIsSignupOpen={setIsSignupOpen} />}
      {isLoginOpen && (
        <Login setIsLoginOpen={setIsLoginOpen} setIsAuthenticated={setIsAuthenticated} />
      )}
    </>
  );
};

export default Sidebar;
