/**
 * Script to promote a user to admin role
 * 
 * Usage:
 *   node scripts/makeAdmin.js <email>
 * 
 * For production database (if different from .env):
 *   MONGO_URI="mongodb+srv://..." node scripts/makeAdmin.js <email>
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js";

dotenv.config();

const email = process.argv[2];
const mongoUri = process.env.MONGO_URI;

if (!email) {
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.error("🔐 DevLog - Make Admin Script");
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.error("");
  console.error("❌ Please provide an email address");
  console.error("");
  console.error("Usage:");
  console.error("   node scripts/makeAdmin.js <email>");
  console.error("");
  console.error("Examples:");
  console.error("   node scripts/makeAdmin.js user@example.com");
  console.error("");
  console.error("For production database:");
  console.error("   MONGO_URI=\"mongodb+srv://...\" node scripts/makeAdmin.js user@example.com");
  console.error("");
  process.exit(1);
}

if (!mongoUri) {
  console.error("❌ MONGO_URI not found in environment");
  console.error("   Make sure .env file exists or pass MONGO_URI directly");
  process.exit(1);
}

// Show which database we're connecting to (hiding password)
const sanitizedUri = mongoUri.replace(/:([^@]+)@/, ":****@");

async function makeAdmin() {
  try {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔐 DevLog - Make Admin Script");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📦 Connecting to: ${sanitizedUri}`);
    
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB\n");

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.error(`❌ User not found: ${email}`);

      // List all users for reference
      const allUsers = await User.find({}, "email role").lean();
      if (allUsers.length > 0) {
        console.log("\n📋 Existing users:");
        allUsers.forEach((u) => {
          const roleIcon = u.role === "admin" ? "👑" : "👤";
          console.log(`   ${roleIcon} ${u.email} (${u.role || "user"})`);
        });
      } else {
        console.log("\n📋 No users found in database");
      }

      process.exit(1);
    }

    if (user.role === "admin") {
      console.log(`ℹ️  ${email} is already an admin`);
      console.log(`   User ID: ${user._id}`);
      process.exit(0);
    }

    user.role = "admin";
    await user.save();

    console.log(`✅ Successfully promoted ${email} to admin!`);
    console.log(`   User ID: ${user._id}`);
    console.log(`   Role: ${user.role}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

makeAdmin();
