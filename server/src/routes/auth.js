import {
  register,
  login,
  getMe,
} from "../controllers/authController.js";
import { validateRegister, validateLogin } from "../middleware/validation.js";
import { protect } from "../middleware/auth.js";
import express from "express";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", validateRegister, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", validateLogin, login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/me", protect, getMe);

export default router;


