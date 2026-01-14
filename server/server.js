import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.js";
import platformRoutes from "./src/routes/platforms.js";
import statsRoutes from "./src/routes/stats.js";
import adminRoutes from "./src/routes/admin.js";
import passwordRoutes from "./src/routes/password.js";
import userRoutes from "./src/routes/user.js";
// New V2 routes
import historyRoutes from "./src/routes/history.js";
import contestRoutes from "./src/routes/contests.js";
import insightRoutes from "./src/routes/insights.js";
import notificationRoutes from "./src/routes/notifications.js";
import publicRoutes from "./src/routes/public.js";
import cronRoutes from "./src/routes/cron.js";
import { apiLimiter } from "./src/middleware/rateLimit.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Rate limiting
app.use("/api", apiLimiter);

// Middleware
app.use(express.json());

// CORS configuration for production
const allowedOrigins = [
  process.env.CLIENT_URL,
  // Production URLs
  "https://my-devlog.vercel.app",
  "https://devlog-server.vercel.app",
  // Local development URLs
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
].filter(Boolean);

// Log CORS configuration for debugging
console.log("🔐 CORS Configuration:");
console.log("CLIENT_URL:", process.env.CLIENT_URL);
console.log("Allowed Origins:", allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, cron jobs, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Origin blocked:", origin);
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Cron-Secret"],
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));

// Connect database
connectDB();

// Root route
app.get("/", (req, res) => {
  res.send("DevLog API V2 is running...");
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    version: "2.0.0",
    environment: process.env.NODE_ENV,
    clientUrl: process.env.CLIENT_URL,
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

// Core API Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", passwordRoutes);
app.use("/api/platforms", platformRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

// V2 API Routes
app.use("/api/history", historyRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/cron", cronRoutes);

// Public profile route (no /api prefix for clean URLs)
app.use("/u", publicRoutes);

// Create HTTP server
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 DevLog V2 Server running on port ${PORT}`);
  console.log(`📡 Open server at http://localhost:${PORT}`);
});
