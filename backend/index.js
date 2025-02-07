const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./db/dbconnection"); 
const Note = require("./route/Note");
const Auth = require("./route/Auth");
require("dotenv").config();

const app = express();  
connectDB(); 
 
app.use(
  cors({
    origin: process.env.FRONTEND_URL,  
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,  
    allowedHeaders: "Content-Type, Authorization",
  })
);
 
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).end(); 
  }

  next();
});
 
app.use(express.json()); 
app.use(bodyParser.json());
 
app.get("/", (req, res) => {
  res.send("Hello from the backend");
});
 
app.use("/api/note", Note);
app.use("/api/user", Auth); 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
