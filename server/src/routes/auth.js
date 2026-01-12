import { register, login } from "../controllers/authController.js";
import { validateRegister, validateLogin } from "../middleware/validation.js";
import { authLimiter } from "../middleware/rateLimit.js";
import express from "express";

const router = express.Router();

router.use(authLimiter);

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);


export default router;
