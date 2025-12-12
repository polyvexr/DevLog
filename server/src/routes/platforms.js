import express from "express";
import { protect } from "../middleware/auth.js";
import { linkPlatform, getPlatforms } from "../controllers/platformController.js";

const router = express.Router();

router.post("/link", protect, linkPlatform);
router.get("/", protect, getPlatforms);

export default router;
