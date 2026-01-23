import {
  processSyncJobs,
  fetchContests
} from "../cron/index.js";
import { platformService } from "../services/platformService.js";
import { telegramService } from "../services/telegramService.js";
import connectDB from "../config/db.js";

/**
 * Cron Controller - Endpoints for Lambda/serverless cron triggers
 * These endpoints should be protected with an API key in production
 */

/**
 * Common authorization helper for cron jobs
 */
const authorizeCron = (req) => {
  const cronSecret = req.headers["x-cron-secret"] || req.query["x-cron-secret"];
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  // Check if either X-Cron-Secret, Authorization: Bearer, or ?x-cron-secret matches
  if (!process.env.CRON_SECRET) return true; // Don't block if secret not configured (dev)

  return cronSecret === process.env.CRON_SECRET || bearerToken === process.env.CRON_SECRET;
};

/**
 * POST/GET /api/cron/sync
 * Process pending sync jobs (every 1 minute on Pro, daily on Hobby)
 */
export const handleSyncCron = async (req, res) => {
  try {
    if (!authorizeCron(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Ensure DB is connected before processing
    await connectDB();

    const result = await processSyncJobs();
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST/GET /api/cron/contests
 * Fetch contests from all platforms (hourly or admin-triggered)
 */
export const handleContestsCron = async (req, res) => {
  try {
    const isAuthenticated = req.user && req.user.role === "admin";

    // Allow access if: valid cron secret OR authenticated admin
    if (!authorizeCron(req) && !isAuthenticated) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Ensure DB is connected before processing
    await connectDB();

    const result = await fetchContests();
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST/GET /api/cron/all
 * Unified endpoint for Hobby plan - runs both sync and contests
 */
export const handleUnifiedCron = async (req, res) => {
  try {
    if (!authorizeCron(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Ensure DB is connected before processing
    await connectDB();

    const startTime = Date.now();

    // 1. Schedule jobs for everyone (adds to queue if not already there today)
    const scheduleResult = await platformService.scheduleGlobalSync();

    // 2. Process a batch of sync jobs from the queue
    const syncResult = await processSyncJobs({ batchSize: 50 });

    // 3. Fetch upcoming contests
    const contestsResult = await fetchContests();

    const finalResult = {
      success: true,
      executionMs: Date.now() - startTime,
      schedule: scheduleResult,
      sync: syncResult,
      contests: contestsResult
    };

    // 4. Send Telegram notification (don't await or catch to avoid blocking response)
    telegramService.sendSyncReport(finalResult).catch(err => {
      console.error("Telegram notification failed:", err.message);
    });

    res.json(finalResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




