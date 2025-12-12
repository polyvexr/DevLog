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

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// app.use("/", (req, res)=>{
//     res.send("api is running....")
// })

app.use("/api/auth", authRoutes);
app.use("/api/platforms", platformRoutes);
app.use("/api/stats", statsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on ${PORT} http://localhost:${PORT}`)
);
