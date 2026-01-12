import express from "express";
import { 
  handleSyncCron, 
  handleContestsCron, 
  handleSnapshotsCron, 
  handleInsightsCron, 
  handleNotificationsCron 
} from "../controllers/cronController.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Cron routes - protected by CRON_SECRET header
// Contests route also accepts admin authentication

// POST /api/cron/sync - Process sync jobs (every 1 min)
router.post("/sync", handleSyncCron);

// POST /api/cron/contests - Fetch contests (hourly or admin-triggered)
router.post("/contests", optionalAuth, handleContestsCron);

// POST /api/cron/snapshots - Create snapshots (daily)
router.post("/snapshots", handleSnapshotsCron);

// POST /api/cron/insights - Generate insights (daily)
router.post("/insights", handleInsightsCron);

// POST /api/cron/notifications - Dispatch notifications (every 5 min)
router.post("/notifications", handleNotificationsCron);

export default router;
