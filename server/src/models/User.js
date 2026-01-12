import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  oneTimeReaddUsed: { type: Map, of: Boolean, default: {} },
  // Profile subdocument
  profile: {
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    website: { type: String, default: "" },
  },
  // Settings subdocument
  settings: {
    theme: { type: String, enum: ["light", "dark", "system"], default: "dark" },
    emailNotifications: { type: Boolean, default: true },
    progressMilestones: {
      leetcode: { type: Number, default: 500 },
      codeforces: { type: Number, default: 1500 },
      github: { type: Number, default: 100 },
    },
    timezone: { type: String, default: "UTC" },
  },
  // Password reset fields
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: { type: Date, default: Date.now },
});

// Hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

// Generate password reset token
userSchema.methods.generateResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  return token;
};

export default mongoose.model("User", userSchema);
