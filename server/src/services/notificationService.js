import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { Resend } from "resend";

// Initialize Resend client (will be null if RESEND_API_KEY not set)
let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

/**
 * Notification Service - In-app and email notifications
 */
export const notificationService = {
  /**
   * Get notifications for a user
   */
  async getNotifications(userId, options = {}) {
    const { limit = 50, unreadOnly = false } = options;

    const query = { userId, sent: true };
    if (unreadOnly) {
      query.read = false;
    }

    return Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);
  },

  /**
   * Get unread count
   */
  async getUnreadCount(userId) {
    return Notification.countDocuments({
      userId,
      read: false,
      sent: true
    });
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true },
      { new: true }
    );
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId) {
    return Notification.updateMany(
      { userId, read: false },
      { read: true }
    );
  },

  /**
   * Create a notification
   */
  async createNotification(options) {
    const { 
      userId, 
      type, 
      title, 
      message, 
      data = {}, 
      emailEnabled = false,
      scheduledFor = null 
    } = options;

    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      data,
      emailEnabled,
      scheduledFor: scheduledFor || new Date(),
      sent: !scheduledFor, // Immediately sent if not scheduled
      sentAt: !scheduledFor ? new Date() : null
    });

    return notification;
  },

  /**
   * Create contest reminder notification
   */
  async createContestReminder(userId, contest) {
    // Check if reminder already exists
    const existing = await Notification.findOne({
      userId,
      type: "contest_reminder",
      "data.contestId": contest._id.toString()
    });

    if (existing) return existing;

    const user = await User.findById(userId).select("settings");

    return this.createNotification({
      userId,
      type: "contest_reminder",
      title: `Upcoming Contest: ${contest.name}`,
      message: `${contest.name} starts in 24 hours on ${contest.platform}`,
      data: {
        contestId: contest._id.toString(),
        platform: contest.platform,
        startTime: contest.startTime,
        url: contest.url
      },
      emailEnabled: user?.settings?.emailNotifications ?? false
    });
  },

  /**
   * Create insight notification
   */
  async createInsightNotification(userId, insight) {
    return this.createNotification({
      userId,
      type: "insight_generated",
      title: insight.title,
      message: insight.message,
      data: {
        insightId: insight._id.toString(),
        insightType: insight.type,
        platform: insight.platform
      }
    });
  },

  /**
   * Create sync complete notification
   */
  async createSyncCompleteNotification(userId, platform, stats) {
    return this.createNotification({
      userId,
      type: "system",
      title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Data Updated`,
      message: `Your ${platform} statistics have been refreshed successfully.`,
      data: {
        platform,
        syncedAt: new Date().toISOString(),
        ...stats
      }
    });
  },

  /**
   * Create weekly summary notification
   */
  async createWeeklySummaryNotification(userId, summary) {
    const user = await User.findById(userId).select("settings");
    
    return this.createNotification({
      userId,
      type: "weekly_summary",
      title: "Your Weekly DevLog Summary 📊",
      message: `This week: ${summary.problemsSolved || 0} problems solved, ${summary.ratingChange >= 0 ? '+' : ''}${summary.ratingChange || 0} rating change.`,
      data: {
        ...summary,
        weekOf: new Date().toISOString()
      },
      emailEnabled: user?.settings?.emailNotifications ?? false
    });
  },

  /**
   * Create achievement/milestone notification
   */
  async createAchievementNotification(userId, achievement) {
    return this.createNotification({
      userId,
      type: "milestone_achieved",
      title: `Achievement Unlocked: ${achievement.title} 🏆`,
      message: achievement.message,
      data: {
        achievementType: achievement.type,
        ...achievement.data
      }
    });
  },

  /**
   * Create platform link reminder notification
   */
  async createPlatformLinkReminderNotification(userId, platforms) {
    const platformList = platforms.join(", ");
    return this.createNotification({
      userId,
      type: "system",
      title: "Complete Your Profile",
      message: `Link your ${platformList} account(s) to get comprehensive coding insights and track your progress across all platforms.`,
      data: {
        suggestedPlatforms: platforms
      }
    });
  },

  /**
   * Create streak warning notification
   */
  async createStreakWarningNotification(userId, platform, currentStreak) {
    return this.createNotification({
      userId,
      type: "streak_warning",
      title: "Don't Break Your Streak! 🔥",
      message: `Your ${currentStreak}-day ${platform} streak is at risk! Solve a problem today to keep it going.`,
      data: {
        platform,
        currentStreak
      }
    });
  },

  /**
   * Dispatch pending notifications (cron job)
   */
  async dispatchPendingNotifications(options = {}) {
    const { batchSize = 50 } = options;

    const now = new Date();

    // Find notifications ready to be sent
    const pendingNotifications = await Notification.find({
      sent: false,
      scheduledFor: { $lte: now }
    })
      .limit(batchSize)
      .sort({ scheduledFor: 1 });

    const results = {
      processed: 0,
      emailsSent: 0,
      errors: []
    };

    for (const notification of pendingNotifications) {
      try {
        // Mark as sent (in-app)
        notification.sent = true;
        notification.sentAt = new Date();

        // Send email if enabled
        if (notification.emailEnabled && !notification.emailSent) {
          const emailResult = await this.sendEmailNotification(notification);
          if (emailResult.success) {
            notification.emailSent = true;
            notification.emailSentAt = new Date();
            results.emailsSent++;
          }
        }

        await notification.save();
        results.processed++;
      } catch (error) {
        results.errors.push({
          notificationId: notification._id,
          error: error.message
        });
      }
    }

    return results;
  },

  /**
   * Send email notification via Resend
   */
  async sendEmailNotification(notification) {
    if (!resend) {
      return { success: false, error: "Resend not configured" };
    }

    try {
      const user = await User.findById(notification.userId).select("email name");
      if (!user?.email) {
        return { success: false, error: "User email not found" };
      }

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "DevLog <notifications@devlog.app>",
        to: user.email,
        subject: notification.title,
        html: this.generateEmailHtml(notification, user)
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Generate email HTML template
   */
  generateEmailHtml(notification, user) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${notification.title}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
          .message { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; }
          .cta { display: inline-block; background: #667eea; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
          .footer { text-align: center; color: #94a3b8; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>DevLog</h1>
        </div>
        <div class="content">
          <p>Hi ${user.name || "Developer"},</p>
          <div class="message">
            <strong>${notification.title}</strong>
            <p>${notification.message}</p>
          </div>
          ${notification.data?.url ? `<a href="${notification.data.url}" class="cta">View Details</a>` : ""}
        </div>
        <div class="footer">
          <p>You're receiving this because you enabled email notifications in DevLog.</p>
        </div>
      </body>
      </html>
    `;
  }
};

export default notificationService;
