import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
    });

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    res.json({ success: true, user: userResponse });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const match = await user.matchPassword(password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Check if user is admin
    const isAdmin = email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();

    res.json({ success: true, token, isAdmin });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
