import mongoose from "mongoose";

/**
 * PlatformStatHistory Model - Historical snapshots for progress tracking
 * Stores daily snapshots of platform stats to enable trend visualization
 */
const platformStatHistorySchema = new mongoose.Schema({
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
  
  // Snapshot date (normalized to midnight UTC)
  snapshotDate: { 
    type: Date, 
    required: true,
    index: true 
  },
  
  // Complete stats snapshot at the time of capture
  statsSnapshot: { 
    type: Object, 
    default: {} 
  },
  
  // Key metrics extracted for quick querying
  metrics: {
    // LeetCode metrics
    totalSolved: { type: Number, default: null },
    easySolved: { type: Number, default: null },
    mediumSolved: { type: Number, default: null },
    hardSolved: { type: Number, default: null },
    
    // Codeforces metrics
    rating: { type: Number, default: null },
    maxRating: { type: Number, default: null },
    problemsSolved: { type: Number, default: null },
    
    // GitHub metrics
    totalRepos: { type: Number, default: null },
    totalStars: { type: Number, default: null },
    totalCommits: { type: Number, default: null },
    contributions: { type: Number, default: null },
    
    // CodeChef metrics
    highestRating: { type: Number, default: null },
    stars: { type: Number, default: null },
    globalRank: { type: Number, default: null },
    countryRank: { type: Number, default: null },
    
    // AtCoder metrics
    acCount: { type: Number, default: null },
    contestsParticipated: { type: Number, default: null },
    averagePerformance: { type: Number, default: null }
  },
  
  createdAt: { type: Date, default: Date.now }
});

// Compound index for efficient history queries
platformStatHistorySchema.index({ userId: 1, platform: 1, snapshotDate: -1 });

// Unique constraint to prevent duplicate snapshots
platformStatHistorySchema.index(
  { userId: 1, platform: 1, snapshotDate: 1 }, 
  { unique: true }
);

export default mongoose.model("PlatformStatHistory", platformStatHistorySchema);
