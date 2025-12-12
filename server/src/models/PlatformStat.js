import mongoose from "mongoose";

const platformStatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  platform: { type: String, enum: ["leetcode", "codeforces", "github"] },
  username: String,
  stats: { type: Object, default: {} },
  lastUpdated: Date,
});

export default mongoose.model("PlatformStat", platformStatSchema);
