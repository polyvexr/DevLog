import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getProfile,
  updateProfile,
  updateSettings,
  updatePassword,
  deleteAccount,
  updateAvatar
} from "../controllers/userController.js";
import { upload } from "../utils/cloudinary.js";

const router = express.Router();

// All user routes require authentication
router.use(protect);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/avatar", upload.single("avatar"), updateAvatar);
router.put("/settings", updateSettings);
router.put("/password", updatePassword);
router.delete("/account", deleteAccount);

export default router;
