import express from "express";
import {
  handleSyncCron,
  handleContestsCron,
  handleUnifiedCron
} from "../controllers/cronController.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

router.route("/sync").get(handleSyncCron).post(handleSyncCron);

router.route("/contests").get(optionalAuth, handleContestsCron).post(optionalAuth, handleContestsCron);

router.route("/all").get(handleUnifiedCron).post(handleUnifiedCron);

export default router;
