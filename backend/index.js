const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./db/dbconnection"); 
const Note = require("./route/Note");
const Auth = require("./route/Auth");
require("dotenv").config();

const app = express();  
connectDB(); 

// ✅ Correct CORS Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Allow only frontend URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow cookies and authorization headers
    allowedHeaders: "Content-Type, Authorization",
  })
);

// ✅ Handle Preflight Requests Properly
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).end(); // No content for preflight
  }

  next();
});

// ✅ Middleware
app.use(express.json()); 
app.use(bodyParser.json());

// ✅ Basic API Response
app.get("/", (req, res) => {
  res.send("Hello from the backend");
});

// ✅ API Routes
app.use("/api/note", Note);
app.use("/api/user", Auth);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
