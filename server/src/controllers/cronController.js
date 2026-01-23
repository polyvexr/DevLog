import {
  processSyncJobs,
  fetchContests
} from "../cron/index.js";

/**
 * Cron Controller - Endpoints for Lambda/serverless cron triggers
 * These endpoints should be protected with an API key in production
 */

/**
 * POST /api/cron/sync
 * Process pending sync jobs (every 1 minute)
 */
export const handleSyncCron = async (req, res) => {
  try {
    // Verify cron secret (for security)
    const cronSecret = req.headers["x-cron-secret"];
    if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await processSyncJobs();
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /api/cron/contests
 * Fetch contests from all platforms (hourly)
 * Can be triggered by cron (with secret) or by admin users
 */
export const handleContestsCron = async (req, res) => {
  try {
    const cronSecret = req.headers["x-cron-secret"];
    const isAuthenticated = req.user && req.user.role === "admin";

    // Allow access if: valid cron secret OR authenticated admin
    if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET && !isAuthenticated) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await fetchContests();
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




