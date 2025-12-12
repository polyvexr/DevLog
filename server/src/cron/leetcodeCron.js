import cron from "node-cron";
import PlatformStat from "../models/PlatformStat.js";
import { fetchLeetCode } from "../utils/fetchLeetCode.js";

cron.schedule("0 */6 * * *", async () => {
  console.log("🔄 Running LeetCode Cron...");

  const users = await PlatformStat.find({ platform: "leetcode" });

  for (const user of users) {
    const stats = await fetchLeetCode(user.username);
    user.stats = stats;
    user.lastUpdated = new Date();
    await user.save();
  }

  console.log("✔ LeetCode stats updated");
});
