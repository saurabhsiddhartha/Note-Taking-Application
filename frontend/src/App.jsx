import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import axios from "axios";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);
  
    if (token) {
      axios
        .post(`${import.meta.env.VITE_SERVER_URL}/api/user/verify-token`, {}, {  // Use POST request
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("Token verification response:", response.data);
          
          if (response.data.valid) {  // Now this will work
            setIsAuthenticated(true);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          } else {
            handleLogout();
          }
        })
        .catch((error) => {
          console.error("Token verification failed:", error);
          handleLogout();
        });
    }
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
  };

  return (
    <div>
      <Home
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
    </div>
  );
};

export default App;
