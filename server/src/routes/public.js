import express from "express";
import { getPublicProfile } from "../controllers/publicProfileController.js";

const router = express.Router();

// Public profile routes - NO AUTHENTICATION REQUIRED

// GET /u/:username - Get public profile
router.get("/:username", getPublicProfile);

export default router;
