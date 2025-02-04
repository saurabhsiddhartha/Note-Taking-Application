const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./db/dbconnection"); 
const Note = require("./route/Note");

const app = express();
app.use(cors());
app.use(bodyParser.json());
connectDB();

// Use noteRoutes
app.use("/api/notes", Note);

app.listen(5000, () => console.log("Server running on port 5000"));
