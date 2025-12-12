import cron from "node-cron";
import PlatformStat from "../models/PlatformStat.js";
import { fetchGithub } from "../utils/fetchGithub.js";

cron.schedule("0 */12 * * *", async () => {
  console.log("🔄 Running GitHub Cron...");

  const users = await PlatformStat.find({ platform: "github" });

  for (const user of users) {
    const stats = await fetchGithub(user.username);
    user.stats = stats;
    user.lastUpdated = new Date();
    await user.save();
  }

  console.log("✔ GitHub stats updated");
});
