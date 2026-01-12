import express from "express";
import { getUpcomingContests, getContestsByPlatform } from "../controllers/contestController.js";

const router = express.Router();

// Contests are publicly accessible (no auth required)

// GET /api/contests - Get all upcoming contests
router.get("/", getUpcomingContests);

// GET /api/contests/:platform - Get contests by platform
router.get("/:platform", getContestsByPlatform);

export default router;
