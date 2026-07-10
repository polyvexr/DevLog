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
    .select("-password")
    .lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(new ApiResponse(200, { user }, "User profile fetched"));
});


export const updateProfile = catchAsync(async (req, res) => {
  const { name, bio, location, website, socials, publicProfile: ppUpdate } = req.body;
  const updates = {};

  if (name?.trim()) updates.name = name.trim();

  // Profile fields
  const p = { bio, location, website, socials };
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
  const { timezone } = req.body;
  const updates = {};

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
