import mongoose from "mongoose";


const syncJobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  platform: {
    type: String,
    enum: ["leetcode", "codeforces", "github", "codechef", "atcoder"],
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
    index: true
  },

  // Idempotency - prevents duplicate processing
  idempotencyKey: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },

  // Execution tracking
  createdAt: { type: Date, default: Date.now },
  startedAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },

  // Retry handling with exponential backoff
  retryCount: { type: Number, default: 0 },
  maxRetries: { type: Number, default: 3 },
  nextRetryAt: { type: Date, default: null, index: true },
  lastError: { type: String, default: null },

  // Metadata
  triggeredBy: {
    type: String,
    enum: ["user", "cron"],
    default: "user"
  },
  executionDurationMs: { type: Number, default: null }
}, {
  timestamps: true
});

// Compound index for efficient cron job queries
syncJobSchema.index({ status: 1, nextRetryAt: 1 });
syncJobSchema.index({ status: 1, createdAt: 1 });
syncJobSchema.index({ platform: 1, status: 1 });
syncJobSchema.index({ userId: 1, platform: 1, status: 1 });

// Auto-delete completed jobs after 30 days
syncJobSchema.index({ completedAt: 1 }, { 
  expireAfterSeconds: 30 * 24 * 60 * 60,
  partialFilterExpression: { status: "completed" }
});

// Auto-delete failed jobs after 7 days
syncJobSchema.index({ updatedAt: 1 }, {
  expireAfterSeconds: 7 * 24 * 60 * 60,
  partialFilterExpression: { status: "failed" }
});

export default mongoose.model("SyncJob", syncJobSchema);
