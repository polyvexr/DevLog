import User from "../models/User.js";
import PlatformStat from "../models/PlatformStat.js";
import PlatformAction from "../models/PlatformAction.js";
import SyncJob from "../models/SyncJob.js";
import { sanitizeUser } from "../middleware/validation.js";
import logger from "../utils/logger.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";


export const getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password -resetPasswordToken -resetPasswordExpires")
    .lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(new ApiResponse(200, { user }, "User profile fetched"));
});


export const updateProfile = catchAsync(async (req, res) => {
  const { name, avatar, bio, location, website, socials, publicProfile: ppUpdate } = req.body;
  const updates = {};

  if (name?.trim()) updates.name = name.trim();

  // Profile fields
  const p = { avatar, bio, location, website, socials };
  Object.keys(p).forEach(k => {
    if (p[k] !== undefined) updates[`profile.${k}`] = p[k];
  });

  // Public profile settings
  if (ppUpdate !== undefined) {
    if (ppUpdate.username) {
      // Check if username differs (enforced logic)
      const user = await User.findById(req.user._id).select("publicProfile.username").lean();
      if (user?.publicProfile?.username && ppUpdate.username !== user.publicProfile.username) {
        throw new ApiError(400, "Username is locked and cannot be changed");
      }
    }

    Object.keys(ppUpdate).forEach(k => {
      updates[`publicProfile.${k}`] = ppUpdate[k];
    });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true }
  ).lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(
    new ApiResponse(200, { user: sanitizeUser(user) }, "Profile updated successfully")
  );
});



export const updateSettings = catchAsync(async (req, res) => {
  const { theme, timezone } = req.body;
  const updates = {};

  if (theme !== undefined) updates["settings.theme"] = theme;
  if (timezone !== undefined) updates["settings.timezone"] = timezone;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true }
  ).lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(
    new ApiResponse(200, { settings: user.settings }, "Settings updated successfully")
  );
});



export const updateAvatar = catchAsync(async (req, res) => {
  logger.info("Avatar upload request received", { userId: req.user._id });

  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  logger.info("File received from Multer/Cloudinary", {
    path: req.file.path,
    size: req.file.size,
    mimetype: req.file.mimetype
  });

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.profile) user.profile = {};
  user.profile.avatar = req.file.path;
  await user.save();

  logger.info("Avatar updated in database", { userId: req.user._id, url: req.file.path });

  res.status(200).json(
    new ApiResponse(200, { url: req.file.path }, "Avatar updated successfully")
  );
});


export const updatePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Both current and new passwords are required");
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, "New password must be at least 6 characters");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(400, "Invalid current password");
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json(new ApiResponse(200, null, "Password updated successfully"));
});


export const deleteAccount = catchAsync(async (req, res) => {
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

  res.status(200).json(
    new ApiResponse(200, null, "Account and all associated data deleted successfully")
  );
});

