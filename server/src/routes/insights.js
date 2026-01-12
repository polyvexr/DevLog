import express from "express";
import { protect } from "../middleware/auth.js";
import { 
  getUserInsights, 
  markInsightAsRead, 
  dismissInsight 
} from "../controllers/insightController.js";

const router = express.Router();

// All insight routes require authentication
router.use(protect);

// GET /api/insights - Get user insights
router.get("/", getUserInsights);

// PATCH /api/insights/:id/read - Mark insight as read
router.patch("/:id/read", markInsightAsRead);

// PATCH /api/insights/:id/dismiss - Dismiss insight
router.patch("/:id/dismiss", dismissInsight);

export default router;
