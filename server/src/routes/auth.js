import {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  updateSettings,
} from "../controllers/authController.js";
import { validateRegister, validateLogin } from "../middleware/validation.js";
import { authLimiter } from "../middleware/rateLimit.js";
import { protect } from "../middleware/auth.js";
import express from "express";

const router = express.Router();

// Public routes (with strict rate limiting)
router.post("/register", authLimiter, validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);

// Protected routes (require authentication)
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, updatePassword);
router.put("/settings", protect, updateSettings);

export default router;

