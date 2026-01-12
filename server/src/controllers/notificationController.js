import { notificationService } from "../services/notificationService.js";

/**
 * Notification Controller - In-app notification endpoints
 */

/**
 * GET /api/notifications
 * Get notifications for the current user
 */
export const getNotifications = async (req, res) => {
  try {
    const { limit = 50, unreadOnly = false } = req.query;

    const notifications = await notificationService.getNotifications(
      req.user._id,
      {
        limit: parseInt(limit),
        unreadOnly: unreadOnly === "true"
      }
    );

    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/notifications/unread
 * Get unread notification count
 */
export const getUnreadCount = async (req, res) => {
  try {
    const count = await notificationService.getUnreadCount(req.user._id);
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * PATCH /api/notifications/:id/read
 * Mark a notification as read
 */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await notificationService.markAsRead(id, req.user._id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read
 */
export const markAllAsRead = async (req, res) => {
  try {
    const result = await notificationService.markAllAsRead(req.user._id);
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
