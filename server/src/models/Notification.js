import mongoose from "mongoose";

/**
 * Notification Model - In-app and email notifications
 * Supports contest reminders, weekly summaries, and alerts
 */
const notificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    index: true 
  },
  
  // Notification type
  type: { 
    type: String, 
    enum: [
      "contest_reminder",    // Upcoming contest notification
      "weekly_summary",      // Weekly progress summary
      "streak_broken",       // Streak lost alert
      "streak_warning",      // Streak at risk (about to expire)
      "refresh_available",   // Cooldown expired, can refresh
      "milestone_achieved",  // Achievement unlocked
      "insight_generated",   // New insight available
      "system"               // System announcements
    ], 
    required: true 
  },
  
  // Notification content
  title: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  
  // Structured data for action buttons, links, etc.
  data: { 
    type: Object, 
    default: {} 
  },
  
  // Read status
  read: { 
    type: Boolean, 
    default: false,
    index: true 
  },
  
  // Email delivery tracking
  emailEnabled: { 
    type: Boolean, 
    default: false 
  },
  emailSent: { 
    type: Boolean, 
    default: false 
  },
  emailSentAt: { 
    type: Date, 
    default: null 
  },
  
  // Scheduling for deferred notifications
  scheduledFor: { 
    type: Date, 
    default: null,
    index: true 
  },
  sent: { 
    type: Boolean, 
    default: false,
    index: true 
  },
  sentAt: { 
    type: Date, 
    default: null 
  },
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Compound index for notification queries
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

// Index for cron dispatch query
notificationSchema.index({ sent: 1, scheduledFor: 1 });

export default mongoose.model("Notification", notificationSchema);
