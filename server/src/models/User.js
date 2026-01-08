import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  oneTimeReaddUsed: { type: Map, of: Boolean, default: {} },
  profile: {
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" },
    location: { type: String, default: "" },
    website: { type: String, default: "" },
  },
  settings: {
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },
    emailNotifications: { type: Boolean, default: true },
    progressMilestones: {
      leetcode: { type: Number, default: 500 },
      codeforces: { type: Number, default: 1500 },
      github: { type: Number, default: 100 },
    },
    timezone: { type: String, default: "UTC" },
  },
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

export default mongoose.model("User", userSchema);
