const cron = require("node-cron");
const fetchLeetCode = require("../utils/fetchLeetCode");

function schedule() {
  // example: every hour
  cron.schedule("0 * * * *", async () => {
    try {
      console.log("[cron] leetcode cron running");
      const data = await fetchLeetCode();
      console.log("[cron] leetcode fetched:", Object.keys(data || {}).length);
    } catch (err) {
      console.error("[cron] leetcode error", err.message);
    }
  });
}

module.exports = { schedule };
