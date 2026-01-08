import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getAllStats,
  getStatsSummary,
  refreshPlatformStats,
} from "../controllers/statsController.js";

const router = express.Router();

router.get("/all", protect, getAllStats);
router.get("/summary", protect, getStatsSummary);
router.post("/refresh/:platform", protect, refreshPlatformStats);

export default router;
