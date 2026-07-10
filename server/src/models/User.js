import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
    socials: { type: Array, default: [] }, // Array of { platform, username }
  },

  // Public profile settings for /u/:username route
  publicProfile: {
    enabled: { type: Boolean, default: true },
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
  createdAt: { type: Date, default: Date.now },
});


// Hash password
userSchema.pre("save", async function () {
  if (this.email && !this.publicProfile.username) {
    // Generate unique username: email prefix + last 4 chars of ObjectId
    const base = this.email.split('@')[0];
    const suffix = this._id.toString().slice(-4);
    this.publicProfile.username = `${base}-${suffix}`;
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


// Compound index for public profile lookups
userSchema.index({ "publicProfile.username": 1, "publicProfile.enabled": 1 });

export default mongoose.model("User", userSchema);
