import mongoose from "mongoose";

/**
 * SyncJob Model - Database-driven job queue for serverless architecture
 * Replaces BullMQ/Redis with MongoDB-based job state management
 */
const syncJobSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    index: true 
  },
  platform: { 
    type: String, 
    enum: ["leetcode", "codeforces", "github"], 
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
    enum: ["user", "admin", "cron"], 
    default: "user" 
  },
  executionDurationMs: { type: Number, default: null }
});

// Compound index for efficient cron job queries
syncJobSchema.index({ status: 1, nextRetryAt: 1 });
syncJobSchema.index({ status: 1, createdAt: 1 });

export default mongoose.model("SyncJob", syncJobSchema);
