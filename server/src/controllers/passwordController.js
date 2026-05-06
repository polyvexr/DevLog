import User from "../models/User.js";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../services/emailService.js";
import catchAsync from "../utils/catchAsync.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

/**
 * Request password reset
 * POST /api/auth/forgot-password
 */
export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    // Don't reveal if email exists or not (security)
    return res.status(200).json(new ApiResponse(200, null, "If an account exists, a reset link will be sent"));
  }

  // Generate reset token
  const resetToken = user.generateResetToken();
  await user.save();

  // Dispatch email notification
  const emailResult = await sendResetPasswordEmail(user.email, resetToken);

  // For development, log the token as fallback
  if (process.env.NODE_ENV === "development") {
    console.log("=================================");
    console.log("Password Reset Token for:", email);
    console.log("Email Dispatch:", emailResult.success ? "ACCEPTED" : "FAILED");
    console.log("Token:", resetToken);
    console.log("Reset URL: http://localhost:5173/reset-password/" + resetToken);
    console.log("=================================");
  }

  // NEVER include tokens in API response body — console log only in dev
  res.status(200).json(new ApiResponse(200, null, "If an account exists, a reset link will be sent"));
});

/**
 * Reset password with token
 * POST /api/auth/reset-password/:token
 */
export const resetPassword = catchAsync(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json(new ApiResponse(200, null, "Password reset successful. You can now login."));
});

/**
 * Verify reset token is valid
 * GET /api/auth/verify-reset-token/:token
 */
export const verifyResetToken = catchAsync(async (req, res) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).lean();

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  res.status(200).json(new ApiResponse(200, { valid: true }));
});

