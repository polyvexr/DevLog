/**
 * Script to promote a user to admin role
 * Usage: node scripts/makeAdmin.js <email>
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js";

dotenv.config();

const email = process.argv[2];

if (!email) {
  console.error("❌ Please provide an email: node scripts/makeAdmin.js <email>");
  process.exit(1);
}

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📦 Connected to MongoDB");

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.error(`❌ User not found: ${email}`);
      process.exit(1);
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
