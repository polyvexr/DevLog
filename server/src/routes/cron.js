import express from "express";
import {
  handleSyncCron,
  handleContestsCron
} from "../controllers/cronController.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Cron routes - protected by CRON_SECRET header
// Contests route also accepts admin authentication

// POST /api/cron/sync - Process sync jobs (every 1 min)
router.post("/sync", handleSyncCron);

// POST /api/cron/contests - Fetch contests (hourly or admin-triggered)
router.post("/contests", optionalAuth, handleContestsCron);

export default router;
