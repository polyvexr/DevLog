import { notificationService } from "../services/notificationService.js";

/**
 * Dispatch pending notifications (runs every 5 minutes)
 * Handles both in-app and email notifications
 */
export async function dispatchNotifications() {
  const startTime = Date.now();

  try {
    const result = await notificationService.dispatchPendingNotifications({
      batchSize: 50
    });

    return {
      success: true,
      ...result,
      executionMs: Date.now() - startTime
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      executionMs: Date.now() - startTime
    };
  }
}

export default dispatchNotifications;
