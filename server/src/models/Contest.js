import mongoose from "mongoose";

/**
 * Contest Model - Aggregated contests from multiple platforms
 * Unified calendar for LeetCode, Codeforces, CodeChef, AtCoder
 */
const contestSchema = new mongoose.Schema({
  platform: { 
    type: String, 
    enum: ["leetcode", "codeforces", "codechef", "atcoder"], 
    required: true,
    index: true 
  },
  
  // Platform-specific contest identifier
  contestId: { 
    type: String, 
    required: true 
  },
  
  // Contest details
  name: { 
    type: String, 
    required: true 
  },
  startTime: { 
    type: Date, 
    required: true,
    index: true 
  },
  endTime: { 
    type: Date, 
    default: null 
  },
  duration: { 
    type: Number, // Duration in minutes
    required: true 
  },
  
  // Contest links
  url: { 
    type: String, 
    required: true 
  },
  
  // Optional metadata
  difficulty: { 
    type: String, 
    enum: ["easy", "medium", "hard", "mixed", null], 
    default: null 
  },
  division: { 
    type: String, // e.g., "Div. 1", "Div. 2" for Codeforces
    default: null 
  },
  rated: { 
    type: Boolean, 
    default: true 
  },
  
  // Fetch tracking
  fetchedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Unique constraint per platform
contestSchema.index({ platform: 1, contestId: 1 }, { unique: true });

// Index for upcoming contests query
contestSchema.index({ startTime: 1, platform: 1 });

export default mongoose.model("Contest", contestSchema);
