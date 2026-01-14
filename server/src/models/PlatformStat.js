import mongoose from "mongoose";

const platformStatSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true,
    index: true 
  },
  platform: { 
    type: String, 
    enum: ["leetcode", "codeforces", "github", "codechef", "atcoder"],
    required: true,
    index: true 
  },
  username: { type: String, required: true },
  data: { type: Object, default: {} },
  stats: { type: Object, default: {} },
  lastUpdated: { type: Date, default: null },
  lastManualRefresh: { type: Date, default: null },
}, {
  timestamps: true
});

// Compound index for efficient queries
platformStatSchema.index({ userId: 1, platform: 1 }, { unique: true });
platformStatSchema.index({ platform: 1, lastUpdated: -1 });

export default mongoose.model("PlatformStat", platformStatSchema);
