import {
  register,
  login,
  getMe,
} from "../controllers/authController.js";
import { validateRegister, validateLogin } from "../middleware/validation.js";
import { protect } from "../middleware/auth.js";
import express from "express";

const router = express.Router();

router.post("/register", validateRegister, register);

router.post("/login", validateLogin, login);

router.get("/me", protect, getMe);

export default router;


