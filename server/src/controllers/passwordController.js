import User from "../models/User.js";
import crypto from "crypto";

/**
 * Request password reset
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Don't reveal if email exists or not (security)
      return res.json({ 
        success: true, 
        message: "If an account exists, a reset link will be sent" 
      });
    }

    // Generate reset token
    const resetToken = user.generateResetToken();
    await user.save();

    // In production, send email here with resetToken
    // For development, log the token
    console.log("=================================");
    console.log("Password Reset Token for:", email);
    console.log("Token:", resetToken);
    console.log("Reset URL: http://localhost:5173/reset-password/" + resetToken);
    console.log("=================================");

    res.json({ 
      success: true, 
      message: "If an account exists, a reset link will be sent",
      // Only include token in development
      ...(process.env.NODE_ENV === "development" && { 
        devToken: resetToken,
        devNote: "This token is only shown in development mode"
      })
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Reset password with token
 * POST /api/auth/reset-password/:token
 */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters" 
      });
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Invalid or expired reset token" 
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ 
      success: true, 
      message: "Password reset successful. You can now login." 
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Verify reset token is valid
 * GET /api/auth/verify-reset-token/:token
 */
export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ 
        valid: false,
        message: "Invalid or expired reset token" 
      });
    }

    res.json({ valid: true });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
