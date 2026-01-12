import express from "express";
import { protect } from "../middleware/auth.js";
import { 
  getNotifications, 
  getUnreadCount, 
  markAsRead, 
  markAllAsRead 
} from "../controllers/notificationController.js";

const router = express.Router();

// All notification routes require authentication
router.use(protect);

// GET /api/notifications - Get notifications
router.get("/", getNotifications);

// GET /api/notifications/unread - Get unread count
router.get("/unread", getUnreadCount);

// PATCH /api/notifications/:id/read - Mark as read
router.patch("/:id/read", markAsRead);

// PATCH /api/notifications/read-all - Mark all as read
router.patch("/read-all", markAllAsRead);

export default router;
