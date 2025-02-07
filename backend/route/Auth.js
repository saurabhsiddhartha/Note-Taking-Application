const express = require("express");
const bcrypt = require("bcryptjs"); // For password hashing
const jwt = require("jsonwebtoken");
const User = require("../model/User"); // Assuming
require("dotenv").config();
const router = express.Router();

const secretKey = process.env.JWT_SECRET;

router.post("/verify-token", (req, res) => {
    const authHeader = req.headers["authorization"];
  
    if (!authHeader) {
      return res.status(401).json({ valid: false, message: "No token provided" });
    }
  
    const token = authHeader.split(" ")[1]; // Extract token
  
    if (!token) {
      return res.status(401).json({ valid: false, message: "No token found in header" });
    }
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ valid: false, message: err.message || "Invalid or expired token" });
      }
      res.status(200).json({ valid: true, user: decoded });
    });
  });
  

// **User Registration Route**

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();

    // Generate a token
    const token = jwt.sign({ userId: newUser._id }, secretKey, { expiresIn: "1h" });

    res.status(201).json({ message: "User registered successfully.", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// **User Login Route**
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try { 
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
