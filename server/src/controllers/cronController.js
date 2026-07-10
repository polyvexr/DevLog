import {
  processSyncJobs,
  fetchContests
} from "../cron/index.js";
import { platformService } from "../services/platformService.js";
import { telegramService } from "../services/telegramService.js";
import connectDB from "../config/db.js";
import catchAsync from "../utils/catchAsync.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";


const authorizeCron = (req) => {
  const cronSecret = req.headers["x-cron-secret"] || req.query["x-cron-secret"];
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!process.env.CRON_SECRET) {
    // Only allow unauthenticated cron in development
    return process.env.NODE_ENV !== "production";
  }

  return cronSecret === process.env.CRON_SECRET || bearerToken === process.env.CRON_SECRET;
};


export const handleSyncCron = catchAsync(async (req, res) => {
  if (!authorizeCron(req)) {
    throw new ApiError(401, "Unauthorized");
  }

  await connectDB();
  const result = await processSyncJobs();
  res.status(200).json(new ApiResponse(200, result, "Sync cron completed"));
});


export const handleContestsCron = catchAsync(async (req, res) => {
  if (!authorizeCron(req)) {
    throw new ApiError(401, "Unauthorized");
  }

  await connectDB();
  const result = await fetchContests();
  res.status(200).json(new ApiResponse(200, result, "Contests cron completed"));
});


export const handleUnifiedCron = catchAsync(async (req, res) => {
  if (!authorizeCron(req)) {
    throw new ApiError(401, "Unauthorized");
  }

  await connectDB();
  const startTime = Date.now();

  // 1. Schedule jobs for everyone
  const scheduleResult = await platformService.scheduleGlobalSync();

  // 2. Process a batch of sync jobs
  const syncResult = await processSyncJobs({ batchSize: 50 });

  // 3. Fetch upcoming contests
  const contestsResult = await fetchContests();

  const finalResult = {
    executionMs: Date.now() - startTime,
    schedule: scheduleResult,
    sync: syncResult,
    contests: contestsResult
  };

  // 4. Send Telegram report (await to ensure it finishes on serverless)
  try {
    await telegramService.sendSyncReport({ success: true, ...finalResult });
  } catch (err) {
    logger.error("Telegram report failed", { error: err.message });
  }

  res.status(200).json(new ApiResponse(200, finalResult, "Unified cron completed"));
});





