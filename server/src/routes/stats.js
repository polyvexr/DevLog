import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getAllStats,
  getStatsSummary,
  refreshPlatformStats,
  getRefreshStatus,
} from "../controllers/statsController.js";

const router = express.Router();

router.get("/all", protect, getAllStats);
router.get("/summary", protect, getStatsSummary);
router.post("/refresh/:platform", protect, refreshPlatformStats);
router.get("/refresh/status/:jobId", protect, getRefreshStatus);

export default router;
