import express from "express";
import { protect } from "../middleware/auth.js";
import { getHistory, getProgressComparison } from "../controllers/historyController.js";

const router = express.Router();

// All history routes require authentication
router.use(protect);

// GET /api/history/:platform - Get historical snapshots
router.get("/:platform", getHistory);

// GET /api/history/:platform/progress - Get progress comparison
router.get("/:platform/progress", getProgressComparison);

export default router;
