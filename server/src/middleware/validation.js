/**
 * Validation Middleware for DevLog API
 */

// Email validation regex - exported for reuse
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Valid platforms list - exported for reuse
export const validPlatforms = ["leetcode", "codeforces", "github", "codechef", "atcoder"];

import ApiError from "../utils/ApiError.js";

/**
 * Validate registration input
 */
export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || !name.trim()) errors.push("Name is required");
  if (!email) errors.push("Email is required");
  else if (!emailRegex.test(email)) errors.push("Invalid email format");

  if (!password) errors.push("Password is required");
  else if (password.length < 6) errors.push("Password must be at least 6 characters");

  if (errors.length > 0) {
    throw new ApiError(400, "Validation failed", errors);
  }

  next();
};

/**
 * Validate login input
 */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  next();
};

/**
 * Validate platform link input
 */
export const validatePlatformLink = (req, res, next) => {
  const { platform, username } = req.body;

  if (!platform || !validPlatforms.includes(platform.toLowerCase())) {
    throw new ApiError(400, `Platform must be one of: ${validPlatforms.join(", ")}`);
  }

  if (!username || !username.trim()) {
    throw new ApiError(400, "Username is required");
  }

  // Sanitize: alphanumeric, underscores, hyphens, dots only; max 39 chars (GitHub limit)
  const sanitized = username.trim();
  if (sanitized.length > 39 || !/^[a-zA-Z0-9._-]+$/.test(sanitized)) {
    throw new ApiError(400, "Username must be 1-39 characters (letters, numbers, dots, hyphens, underscores)");
  }

  // Normalize platform to lowercase
  req.body.platform = platform.toLowerCase();
  req.body.username = sanitized;

  next();
};

/**
 * Sanitize user object for response (remove sensitive fields)
 */
export const sanitizeUser = (user) => {
  if (!user) return null;

  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.__v;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  return obj;
};
