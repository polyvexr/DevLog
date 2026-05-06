import mongoose from "mongoose";
import logger from "../utils/logger.js";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  if (!process.env.MONGO_URI) {
    logger.error("DB Error ❌ MONGO_URI environment variable is not defined");
    throw new Error("MONGO_URI is required");
  }

  try {
    const opts = {
      serverSelectionTimeoutMS: 10000, // Wait 10s before failing
      socketTimeoutMS: 45000,
    };

    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    logger.info("MongoDB connected");
    
    mongoose.connection.on("disconnected", () => {
      isConnected = false;
      logger.warn("MongoDB disconnected");
    });

    return db;
  } catch (err) {
    logger.error("DB Error ❌", err.message);
    // Don't exit process in serverless
    throw err;
  }
};

export default connectDB;
