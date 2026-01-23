import express from "express";
import {
  handleSyncCron,
  handleContestsCron
} from "../controllers/cronController.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Cron routes - protected by CRON_SECRET header
// Contests route also accepts admin authentication

// POST/GET /api/cron/sync - Process sync jobs
router.route("/sync").get(handleSyncCron).post(handleSyncCron);

// POST/GET /api/cron/contests - Fetch contests
router.route("/contests").get(optionalAuth, handleContestsCron).post(optionalAuth, handleContestsCron);

// POST/GET /api/cron/all - Unified sync and contests (Hobby plan)
router.route("/all").get(handleUnifiedCron).post(handleUnifiedCron);

export default router;
