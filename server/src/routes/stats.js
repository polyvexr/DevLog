import express from "express";
import { protect } from "../middleware/auth.js";
import { getAllStats } from "../controllers/statsController.js";

const router = express.Router();

router.get("/all", protect, getAllStats);

export default router;
