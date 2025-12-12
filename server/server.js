import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/auth.js";
import platformRoutes from "./src/routes/platforms.js";
import statsRoutes from "./src/routes/stats.js";

import "./src/cron/leetcodeCron.js";
import "./src/cron/codeforcesCron.js";
import "./src/cron/githubCron.js";

import cors from "cors";
import path from "path";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// CORS: allow specific client origin via env or fall back to allow all
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// app.use("/", (req, res)=>{
//     res.send("api is running....")
// })

app.use("/api/auth", authRoutes);
app.use("/api/platforms", platformRoutes);
app.use("/api/stats", statsRoutes);

// Serve client build and fallback to index.html for client-side routes
const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "dist")));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) return res.status(404).send("Not Found");
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on ${PORT} http://localhost:${PORT}`)
);
