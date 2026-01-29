import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { emailRegex } from "../middleware/validation.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { sanitizeUser } from "../middleware/validation.js";

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !name.trim()) {
    throw new ApiError(400, "Name is required");
  }

  if (!email || !emailRegex.test(email)) {
    throw new ApiError(400, "Valid email is required");
  }

  if (!password || password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() }).lean();
  if (existingUser) {
    throw new ApiError(400, "Email already registered");
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    password,
  });

  res.status(201).json(
    new ApiResponse(201, { user: sanitizeUser(user) }, "Registration successful")
  );
});

/**
 * Login user
 * POST /api/auth/login
 */
export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const match = await user.matchPassword(password);
  if (!match) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.status(200).json(
    new ApiResponse(200, {
      token,
      isAdmin: user.role === "admin",
      user: sanitizeUser(user)
    }, "Login successful")
  );
});

/**
 * Get current user
 * GET /api/auth/me
 */
export const getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password -resetPasswordToken -resetPasswordExpires")
    .lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(new ApiResponse(200, { user }, "User data fetched"));
});

