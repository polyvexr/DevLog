import mongoose from "mongoose";

const platformActionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    platform: { type: String, enum: ["leetcode", "codeforces", "github"], required: true },
    action: { type: String, enum: ["link", "unlink"], required: true },
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("PlatformAction", platformActionSchema);
