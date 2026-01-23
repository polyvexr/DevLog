import express from "express";
import { getDashboardData } from "../controllers/dashboardController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route   GET /api/dashboard
 * @desc    Get combined dashboard data (stats, platforms, contests)
 * @access  Private
 */
router.get("/", protect, getDashboardData);

export default router;
