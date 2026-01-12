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

// Get current user profile
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile || {},
        settings: user.settings || {},
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, location, website } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Initialize profile if not exists
    if (!user.profile) {
      user.profile = {};
    }

    if (name) user.name = name;
    if (bio !== undefined) user.profile.bio = bio;
    if (location !== undefined) user.profile.location = location;
    if (website !== undefined) user.profile.website = website;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update password
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both passwords are required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await user.matchPassword(currentPassword);
    if (!match) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user settings
export const updateSettings = async (req, res) => {
  try {
    const { theme, emailNotifications, progressMilestones, timezone } =
      req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Initialize settings if not exists
    if (!user.settings) {
      user.settings = {};
    }

    if (theme !== undefined) user.settings.theme = theme;
    if (emailNotifications !== undefined)
      user.settings.emailNotifications = emailNotifications;
    if (progressMilestones !== undefined) {
      // Properly merge nested objects for MongoDB
      const currentMilestones = user.settings.progressMilestones?.toObject?.() 
        || user.settings.progressMilestones 
        || {};
      user.settings.progressMilestones = {
        ...currentMilestones,
        ...progressMilestones,
      };
      user.markModified('settings.progressMilestones');
    }
    if (timezone !== undefined) user.settings.timezone = timezone;

    await user.save();

    res.json({
      success: true,
      settings: user.settings,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

