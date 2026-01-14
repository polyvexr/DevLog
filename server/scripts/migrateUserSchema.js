/**
 * User Schema Migration Script
 * Usage: 
 *   node scripts/migrateUserSchema.js           # Run migration
 *   node scripts/migrateUserSchema.js --dry-run # Preview changes without applying
 * 
 * This script updates all existing users to match the latest User schema.
 * It adds missing fields with their default values.
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js";

dotenv.config();

const isDryRun = process.argv.includes("--dry-run");

// Define the latest schema defaults
const LATEST_SCHEMA_DEFAULTS = {
  // Top-level fields
  oneTimeReaddUsed: new Map(),
  role: "user",
  permissions: [],
  
  // Profile subdocument
  profile: {
    bio: "",
    location: "",
    website: "",
  },
  
  // Public profile settings
  publicProfile: {
    enabled: false,
    username: undefined, // Don't set, it's unique and sparse
    showLeetCode: true,
    showCodeforces: true,
    showGitHub: true,
  },
  
  // Settings subdocument
  settings: {
    theme: "dark",
    emailNotifications: true,
    progressMilestones: {
      leetcode: 500,
      codeforces: 1500,
      github: 100,
    },
    timezone: "UTC",
  },
  
  // Cooldowns for stateless enforcement
  cooldowns: {
    leetcode: { 
      lastRefresh: null,
      nextAvailable: null
    },
    codeforces: { 
      lastRefresh: null,
      nextAvailable: null
    },
    github: { 
      lastRefresh: null,
      nextAvailable: null
    },
  },
  
  // Serverless job tracking
  lastSnapshotDate: null,
  lastInsightDate: null,
};

/**
 * Deep merge function to preserve existing values while adding missing fields
 */
function deepMerge(target, source) {
  const result = { ...target };
  
  for (const key of Object.keys(source)) {
    if (source[key] === undefined) continue;
    
    if (result[key] === undefined || result[key] === null) {
      // Field is missing, add it
      result[key] = source[key];
    } else if (
      typeof source[key] === "object" && 
      source[key] !== null && 
      !Array.isArray(source[key]) &&
      !(source[key] instanceof Map) &&
      !(source[key] instanceof Date)
    ) {
      // Recursively merge nested objects
      result[key] = deepMerge(result[key] || {}, source[key]);
    }
    // If field exists in target, keep the existing value
  }
  
  return result;
}

/**
 * Get list of missing/added fields for logging
 */
function getMissingFields(user, defaults, prefix = "") {
  const missingFields = [];
  
  for (const key of Object.keys(defaults)) {
    if (defaults[key] === undefined) continue;
    
    const fullPath = prefix ? `${prefix}.${key}` : key;
    const userValue = user[key];
    
    if (userValue === undefined || userValue === null) {
      missingFields.push(fullPath);
    } else if (
      typeof defaults[key] === "object" && 
      defaults[key] !== null && 
      !Array.isArray(defaults[key]) &&
      !(defaults[key] instanceof Map)
    ) {
      // Recursively check nested objects
      const nestedMissing = getMissingFields(
        userValue || {}, 
        defaults[key], 
        fullPath
      );
      missingFields.push(...nestedMissing);
    }
  }
  
  return missingFields;
}

async function migrateUsers() {
  try {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🚀 DevLog User Schema Migration Script");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    if (isDryRun) {
      console.log("🔍 DRY RUN MODE - No changes will be applied\n");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("📦 Connected to MongoDB\n");

    // Get all users
    const users = await User.find({}).lean();
    console.log(`📊 Found ${users.length} user(s) to process\n`);

    if (users.length === 0) {
      console.log("✅ No users to migrate");
      process.exit(0);
    }

    let updatedCount = 0;
    let skippedCount = 0;
    const migrationSummary = [];

    for (const user of users) {
      const missingFields = getMissingFields(user, LATEST_SCHEMA_DEFAULTS);
      
      if (missingFields.length === 0) {
        skippedCount++;
        continue;
      }

      // Build the update object
      const updateObj = {};
      
      // Handle top-level fields
      if (user.oneTimeReaddUsed === undefined) {
        updateObj.oneTimeReaddUsed = {};
      }
      if (user.role === undefined) {
        updateObj.role = LATEST_SCHEMA_DEFAULTS.role;
      }
      if (user.permissions === undefined) {
        updateObj.permissions = LATEST_SCHEMA_DEFAULTS.permissions;
      }
      if (user.lastSnapshotDate === undefined) {
        updateObj.lastSnapshotDate = LATEST_SCHEMA_DEFAULTS.lastSnapshotDate;
      }
      if (user.lastInsightDate === undefined) {
        updateObj.lastInsightDate = LATEST_SCHEMA_DEFAULTS.lastInsightDate;
      }

      // Handle profile subdocument
      const existingProfile = user.profile || {};
      updateObj.profile = deepMerge(existingProfile, LATEST_SCHEMA_DEFAULTS.profile);

      // Handle publicProfile subdocument
      const existingPublicProfile = user.publicProfile || {};
      const mergedPublicProfile = deepMerge(existingPublicProfile, LATEST_SCHEMA_DEFAULTS.publicProfile);
      // Remove username if it's undefined (sparse unique field)
      if (mergedPublicProfile.username === undefined) {
        delete mergedPublicProfile.username;
      }
      updateObj.publicProfile = mergedPublicProfile;

      // Handle settings subdocument
      const existingSettings = user.settings || {};
      const mergedSettings = {
        ...LATEST_SCHEMA_DEFAULTS.settings,
        ...existingSettings,
        progressMilestones: {
          ...LATEST_SCHEMA_DEFAULTS.settings.progressMilestones,
          ...(existingSettings.progressMilestones || {}),
        },
      };
      updateObj.settings = mergedSettings;

      // Handle cooldowns subdocument
      const existingCooldowns = user.cooldowns || {};
      updateObj.cooldowns = {
        leetcode: {
          ...LATEST_SCHEMA_DEFAULTS.cooldowns.leetcode,
          ...(existingCooldowns.leetcode || {}),
        },
        codeforces: {
          ...LATEST_SCHEMA_DEFAULTS.cooldowns.codeforces,
          ...(existingCooldowns.codeforces || {}),
        },
        github: {
          ...LATEST_SCHEMA_DEFAULTS.cooldowns.github,
          ...(existingCooldowns.github || {}),
        },
      };

      const userIdentifier = user.email || user._id;
      
      migrationSummary.push({
        user: userIdentifier,
        missingFields: missingFields,
      });

      if (!isDryRun) {
        await User.updateOne(
          { _id: user._id },
          { $set: updateObj }
        );
      }
      
      updatedCount++;
      
      console.log(`👤 ${userIdentifier}`);
      console.log(`   Missing fields: ${missingFields.join(", ")}`);
      console.log(isDryRun ? "   Status: Would be updated\n" : "   Status: ✅ Updated\n");
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📈 Migration Summary");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`   Total users: ${users.length}`);
    console.log(`   Updated: ${updatedCount}`);
    console.log(`   Skipped (already up-to-date): ${skippedCount}`);
    
    if (isDryRun) {
      console.log("\n🔍 This was a DRY RUN - no changes were applied.");
      console.log("   Run without --dry-run to apply the migration.");
    } else {
      console.log("\n✅ Migration completed successfully!");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration Error:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

migrateUsers();
