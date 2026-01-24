import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getProfile,
  updateProfile,
  updateSettings,
  updatePassword,
  deleteAccount,
} from "../controllers/userController.js";
import { upload } from "../utils/cloudinary.js";

const router = express.Router();

// All user routes require authentication
router.use(protect);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/avatar", (req, res, next) => {
  upload.single("avatar")(req, res, (err) => {
    if (err) {
      console.error("Multer/Cloudinary Error:", err);
      return res.status(500).json({
        success: false,
        message: "Upload failed",
        error: err.message
      });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    res.json({ success: true, url: req.file.path });
  });
});
router.put("/settings", updateSettings);
router.put("/password", updatePassword);
router.delete("/account", deleteAccount);

export default router;
