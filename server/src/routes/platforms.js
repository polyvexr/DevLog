import express from "express";
import { protect } from "../middleware/auth.js";
import {
  linkPlatform,
  getPlatforms,
  unlinkPlatform,
} from "../controllers/platformController.js";

const router = express.Router();

router.post("/link", protect, linkPlatform);
router.get("/", protect, getPlatforms);
router.delete("/:platform", protect, unlinkPlatform);

export default router;
