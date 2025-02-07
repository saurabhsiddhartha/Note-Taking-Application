const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./db/dbconnection"); 
const Note = require("./route/Note");
require("dotenv").config();
const Auth =require('./route/Auth') 
const app = express();  
connectDB(); 
app.use(express.json()); 
app.use(cors()); 

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow cookies if needed
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.use(bodyParser.json());
app.get('/',(req,res)=>{
    res.send("Hello from backend")
})
app.use("/api/note", Note);
app.use("/api/user", Auth);

app.listen(5000, () => console.log("🚀 Server running on port 5000"));