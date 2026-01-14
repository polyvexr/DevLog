import express from "express";
import { protect } from "../middleware/auth.js";
import { validatePlatformLink } from "../middleware/validation.js";
import {
  linkPlatform,
  getPlatforms,
  unlinkPlatform,
  refreshPlatform,
} from "../controllers/platformController.js";

const router = express.Router();

router.post("/link", protect, validatePlatformLink, linkPlatform);
router.get("/", protect, getPlatforms);
router.post("/:platform/refresh", protect, refreshPlatform);
router.delete("/:platform", protect, unlinkPlatform);

export default router;
