import { 
  processSyncJobs, 
  fetchContests, 
  createSnapshots, 
  generateInsights, 
  dispatchNotifications 
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
 */
export const handleContestsCron = async (req, res) => {
  try {
    const cronSecret = req.headers["x-cron-secret"];
    if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await fetchContests();
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /api/cron/snapshots
 * Create daily snapshots (daily at 00:00 UTC)
 */
export const handleSnapshotsCron = async (req, res) => {
  try {
    const cronSecret = req.headers["x-cron-secret"];
    if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { cursor } = req.body;
    const result = await createSnapshots({ cursor });
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /api/cron/insights
 * Generate user insights (daily at 06:00 UTC)
 */
export const handleInsightsCron = async (req, res) => {
  try {
    const cronSecret = req.headers["x-cron-secret"];
    if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { cursor } = req.body;
    const result = await generateInsights({ cursor });
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /api/cron/notifications
 * Dispatch pending notifications (every 5 minutes)
 */
export const handleNotificationsCron = async (req, res) => {
  try {
    const cronSecret = req.headers["x-cron-secret"];
    if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await dispatchNotifications();
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
