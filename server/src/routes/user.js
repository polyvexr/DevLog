import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getProfile,
  updateProfile,
  updateSettings,
  updatePassword,
  deleteAccount,
} from "../controllers/userController.js";

const router = express.Router();

// All user routes require authentication
router.use(protect);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/settings", updateSettings);
router.put("/password", updatePassword);
router.delete("/account", deleteAccount);

export default router;
