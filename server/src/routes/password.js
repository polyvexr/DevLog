import express from "express";
import {
  forgotPassword,
  resetPassword,
  verifyResetToken,
} from "../controllers/passwordController.js";
import { authLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

router.use(authLimiter);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset link
 * @access  Public
 */
router.post("/forgot-password", forgotPassword);

/**
 * @route   GET /api/auth/verify-reset-token/:token
 * @desc    Verify if reset token is valid/expired
 * @access  Public
 */
router.get("/verify-reset-token/:token", verifyResetToken);

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Reset password with token
 * @access  Public
 */
router.post("/reset-password/:token", resetPassword);

export default router;
