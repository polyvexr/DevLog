import cron from "node-cron";
import PlatformStat from "../models/PlatformStat.js";
import { fetchCodeforces } from "../utils/fetchCodeforces.js";

cron.schedule("*/30 * * * *", async () => {
  console.log("🔄 Running Codeforces Cron...");

  const users = await PlatformStat.find({ platform: "codeforces" });

  for (const user of users) {
    const stats = await fetchCodeforces(user.username);
    user.stats = stats;
    user.lastUpdated = new Date();
    await user.save();
  }

  console.log("✔ Codeforces stats updated");
});
