import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  oneTimeReaddUsed: { type: Map, of: Boolean, default: {} },

  // RBAC - Role-based access control
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  permissions: [String],

  // Profile subdocument
  profile: {
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    website: { type: String, default: "" },
  },

  // Public profile settings for /u/:username route
  publicProfile: {
    enabled: { type: Boolean, default: false },
    username: { type: String, unique: true, sparse: true },
    showLeetCode: { type: Boolean, default: true },
    showCodeforces: { type: Boolean, default: true },
    showGitHub: { type: Boolean, default: true },
    showCodeChef: { type: Boolean, default: true },
    showAtCoder: { type: Boolean, default: true },
  },

  // Settings subdocument
  settings: {
    theme: { type: String, enum: ["light", "dark", "system"], default: "dark" },
    timezone: { type: String, default: "UTC" },
  },

  // Cooldowns for stateless enforcement (serverless)
  cooldowns: {
    leetcode: {
      lastRefresh: { type: Date, default: null },
      nextAvailable: { type: Date, default: null }
    },
    codeforces: {
      lastRefresh: { type: Date, default: null },
      nextAvailable: { type: Date, default: null }
    },
    github: {
      lastRefresh: { type: Date, default: null },
      nextAvailable: { type: Date, default: null }
    },
    codechef: {
      lastRefresh: { type: Date, default: null },
      nextAvailable: { type: Date, default: null }
    },
    atcoder: {
      lastRefresh: { type: Date, default: null },
      nextAvailable: { type: Date, default: null }
    }
  },

  // Password reset fields
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: { type: Date, default: Date.now },
});


// Hash password
userSchema.pre("save", async function () {
  // Set default public username from email if not set OR always enforce it
  if (this.email && !this.publicProfile.username) {
    this.publicProfile.username = this.email.split('@')[0];
  }

  // Ensure username is always the email prefix (as requested)
  if (this.isModified('email')) {
    this.publicProfile.username = this.email.split('@')[0];
  }

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
