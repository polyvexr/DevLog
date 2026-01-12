import User from "../models/User.js";
import PlatformStat from "../models/PlatformStat.js";
import PlatformAction from "../models/PlatformAction.js";
import { sanitizeUser } from "../middleware/validation.js";

/**
 * Get current user profile
 * GET /api/user/profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update user profile
 * PUT /api/user/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name.trim();
    await user.save();

    res.json({ 
      success: true, 
      user: sanitizeUser(user),
      message: "Profile updated successfully" 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update password from profile
 * PUT /api/user/password
 */
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid current password" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete account and all associated data
 * DELETE /api/user/account
 */
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete all platform stats for this user
    await PlatformStat.deleteMany({ userId });

    // Delete all platform actions for this user
    await PlatformAction.deleteMany({ userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

