import express from "express";
import { getUpcomingContests, getContestsByPlatform } from "../controllers/contestController.js";

const router = express.Router();

router.get("/", getUpcomingContests);

router.get("/:platform", getContestsByPlatform);

export default router;
