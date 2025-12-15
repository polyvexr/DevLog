import express from "express";
import { protect } from "../middleware/auth.js";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  syncAllPlatforms,
  syncLeetCode,
  syncCodeforces,
  syncGitHub,
  getSyncStats,
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes require authentication and admin privileges
router.use(protect);
router.use(adminAuth);

// Sync routes
router.post("/sync/all", syncAllPlatforms);
router.post("/sync/leetcode", syncLeetCode);
router.post("/sync/codeforces", syncCodeforces);
router.post("/sync/github", syncGitHub);

// Stats route
router.get("/stats", getSyncStats);

export default router;
