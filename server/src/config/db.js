import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  if (!process.env.MONGO_URI) {
    console.error("DB Error ❌ MONGO_URI environment variable is not defined");
    return;
  }

  try {
    const opts = {
      serverSelectionTimeoutMS: 10000, // Wait 10s before failing
      socketTimeoutMS: 45000,
    };

    const db = await mongoose.connect(process.env.MONGO_URI, opts);
    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB connected ✔");
  } catch (err) {
    console.error("DB Error ❌", err.message);
    // Don't exit process in serverless
    throw err;
  }
};

export default connectDB;
