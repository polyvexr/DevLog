import jwt from "jsonwebtoken";
import User from "../models/User.js";

import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";

export const protect = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new ApiError(401, "Authentication token missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "devlog-api",
      audience: "devlog-client",
    });
    const user = await User.findById(decoded.id).select("-password").lean();

    if (!user) {
      throw new ApiError(401, "User no longer exists");
    }

    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(401, "Invalid or expired token");
  }
});


export const optionalAuth = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "devlog-api",
      audience: "devlog-client",
    });
    req.user = await User.findById(decoded.id).select("-password").lean();
    next();
  } catch (err) {
    // Invalid token - proceed without authentication
    next();
  }
});
