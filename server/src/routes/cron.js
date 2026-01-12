import express from "express";
import { 
  handleSyncCron, 
  handleContestsCron, 
  handleSnapshotsCron, 
  handleInsightsCron, 
  handleNotificationsCron 
} from "../controllers/cronController.js";

const router = express.Router();

// Cron routes - protected by CRON_SECRET header

// POST /api/cron/sync - Process sync jobs (every 1 min)
router.post("/sync", handleSyncCron);

// POST /api/cron/contests - Fetch contests (hourly)
router.post("/contests", handleContestsCron);

// POST /api/cron/snapshots - Create snapshots (daily)
router.post("/snapshots", handleSnapshotsCron);

// POST /api/cron/insights - Generate insights (daily)
router.post("/insights", handleInsightsCron);

// POST /api/cron/notifications - Dispatch notifications (every 5 min)
router.post("/notifications", handleNotificationsCron);

export default router;
