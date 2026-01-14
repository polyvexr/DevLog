import mongoose from "mongoose";

const platformActionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    platform: { 
      type: String, 
      enum: ["leetcode", "codeforces", "github", "codechef", "atcoder"], 
      required: true,
      index: true 
    },
    action: { type: String, enum: ["link", "unlink"], required: true },
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

// Compound index for efficient queries
platformActionSchema.index({ userId: 1, platform: 1, createdAt: -1 });

export default mongoose.model("PlatformAction", platformActionSchema);
