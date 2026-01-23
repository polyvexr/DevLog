import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import helmet from "helmet";
import compression from "compression";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.js";
import platformRoutes from "./src/routes/platforms.js";
import statsRoutes from "./src/routes/stats.js";
import adminRoutes from "./src/routes/admin.js";
import passwordRoutes from "./src/routes/password.js";
import userRoutes from "./src/routes/user.js";
// New V2 routes
import contestRoutes from "./src/routes/contests.js";
import publicRoutes from "./src/routes/public.js";
import cronRoutes from "./src/routes/cron.js";
import dashboardRoutes from "./src/routes/dashboard.js";
import { apiLimiter } from "./src/middleware/rateLimit.js";
import logger from "./src/utils/logger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
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

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin only for specific paths (handled in custom middleware after this)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn("Origin blocked by CORS", { origin });
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Cron-Secret"],
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));

// Body parser with size limit (prevent DoS)
app.use(express.json({ limit: "10kb" }));

// Security middleware - helmet for HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false,
}));

// Compression middleware for faster responses
app.use(compression());

// Rate limiting
app.use("/api", apiLimiter);

// Paths that allow no-origin requests (for cron jobs)
const noOriginAllowedPaths = ["/api/cron", "/api/health", "/"];

// Custom CORS middleware to restrict no-origin requests
app.use((req, res, next) => {
  // Always allow preflight requests to pass through
  if (req.method === 'OPTIONS') {
    return next();
  }

  const origin = req.headers.origin;
  const path = req.path;

  // If no origin, only allow specific paths
  if (!origin) {
    const isAllowedPath = noOriginAllowedPaths.some(p => path === p || path.startsWith(p + "/"));
    if (!isAllowedPath) {
      logger.warn("Request blocked: No origin and not an allowed path", { path });
      return res.status(403).json({
        success: false,
        message: "Origin required for this endpoint"
      });
    }
  }
  next();
});

// Connect database
connectDB();

// Root route
app.get("/", (req, res) => {
  res.send("DevLog API V2 is running...");
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    data: {
      status: "ok",
      version: "2.0.0",
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    }
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
app.use("/api/contests", contestRoutes);
app.use("/api/cron", cronRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Public profile route (consistency with /api prefix)
app.use("/api/u", publicRoutes);

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  // Log error
  logger.error("Unhandled error", {
    error: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // CORS errors
  if (err.message && err.message.includes("CORS")) {
    return res.status(403).json({
      success: false,
      message: "CORS error: Origin not allowed",
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message,
  });
});

// Create HTTP server
const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`DevLog V2 Server running on port ${PORT}`);
  logger.info(`Open server at http://localhost:${PORT}`);
});
