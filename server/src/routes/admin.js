import express from "express";
import { protect } from "../middleware/auth.js";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  syncAllPlatforms,
  syncPlatform,
  syncLeetCode,
  syncCodeforces,
  syncGitHub,
  syncCodeChef,
  syncAtCoder,
  getSyncStats,
  getAllUsers,
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes require authentication and admin privileges
router.use(protect);
router.use(adminAuth);

// User management
router.get("/users", getAllUsers);

// Sync routes - new generic endpoint
router.post("/sync/all", syncAllPlatforms);
router.post("/sync/:platform", syncPlatform);

// Legacy sync routes (for backwards compatibility)
router.post("/sync/leetcode-legacy", syncLeetCode);
router.post("/sync/codeforces-legacy", syncCodeforces);
router.post("/sync/github-legacy", syncGitHub);
router.post("/sync/codechef-legacy", syncCodeChef);
router.post("/sync/atcoder-legacy", syncAtCoder);

// Stats route
router.get("/stats", getSyncStats);

export default router;
