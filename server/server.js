import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import path from "path";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.js";
import platformRoutes from "./src/routes/platforms.js";
import statsRoutes from "./src/routes/stats.js";
import adminRoutes from "./src/routes/admin.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
    credentials: process.env.CORS_ALLOW_CREDENTIALS === "true",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect database
connectDB();

// Root route
app.get("/", (req, res) => {
  res.send("DevLog API is running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/platforms", platformRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/admin", adminRoutes);

// Serve client build in production
const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "dist")));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ message: "API route not found" });
    }
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open server at http://localhost:${PORT}`);
});
