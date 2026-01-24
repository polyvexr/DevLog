import User from "../models/User.js";
import PlatformStat from "../models/PlatformStat.js";
import PlatformAction from "../models/PlatformAction.js";
import SyncJob from "../models/SyncJob.js";
import { sanitizeUser } from "../middleware/validation.js";
import logger from "../utils/logger.js";

/**
 * Get current user profile
 * GET /api/user/profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -resetPasswordToken -resetPasswordExpires");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: { user } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Update user profile
 * PUT /api/user/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, location, website, socials, publicProfile } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update name
    if (name && name.trim()) {
      user.name = name.trim();
    }

    // Update profile fields
    if (!user.profile) {
      user.profile = {};
    }
    if (bio !== undefined) user.profile.bio = bio;
    if (location !== undefined) user.profile.location = location;
    if (website !== undefined) user.profile.website = website;
    if (socials !== undefined) user.profile.socials = socials;

    // Update public profile settings
    if (publicProfile !== undefined) {
      if (!user.publicProfile) {
        user.publicProfile = {};
      }

      // Prevention of username change (enforced to email prefix)
      if (publicProfile.username && publicProfile.username !== user.publicProfile.username) {
        return res.status(400).json({
          success: false,
          message: "Username is locked to your email identity and cannot be changed"
        });
      }

      Object.assign(user.publicProfile, publicProfile);
      user.markModified('publicProfile');
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: { user: sanitizeUser(user) }
    });
  } catch (err) {
    logger.error("Update profile error", { error: err.message });
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Update user settings
 * PUT /api/user/settings
 */
export const updateSettings = async (req, res) => {
  try {
    const { theme, timezone } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Initialize settings if not exists
    if (!user.settings) {
      user.settings = {};
    }

    if (theme !== undefined) user.settings.theme = theme;
    if (timezone !== undefined) user.settings.timezone = timezone;



    await user.save();

    res.json({
      success: true,
      message: "Settings updated successfully",
      data: { settings: user.settings }
    });
  } catch (err) {
    logger.error("Update settings error", { error: err.message });
    res.status(500).json({ success: false, message: "Server error" });
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
      return res.status(400).json({ success: false, message: "Both current and new passwords are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid current password" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Delete account and all associated data (cascade delete)
 * DELETE /api/user/account
 */
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    logger.info("Account deletion initiated", { userId });

    // Delete all related data (cascade delete)
    const deletions = await Promise.allSettled([
      PlatformStat.deleteMany({ userId }),
      PlatformAction.deleteMany({ userId }),
      SyncJob.deleteMany({ userId }),
    ]);

    // Log deletion results
    const collections = ['PlatformStat', 'PlatformAction', 'SyncJob'];
    deletions.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        logger.info(`Deleted ${collections[index]}`, {
          userId,
          deletedCount: result.value.deletedCount
        });
      } else {
        logger.error(`Failed to delete ${collections[index]}`, {
          userId,
          error: result.reason
        });
      }
    });

    // Delete the user
    await User.findByIdAndDelete(userId);

    logger.info("Account deleted successfully", { userId });

    res.json({ success: true, message: "Account and all associated data deleted successfully" });
  } catch (err) {
    logger.error("Delete account error", { error: err.message });
    res.status(500).json({ success: false, message: "Server error" });
  }
};
