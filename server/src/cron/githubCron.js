const cron = require("node-cron");
const fetchGithub = require("../utils/fetchGithub");

function schedule() {
  cron.schedule("0 * * * *", async () => {
    try {
      console.log("[cron] github cron running");
      const data = await fetchGithub();
      console.log("[cron] github fetched:", Object.keys(data || {}).length);
    } catch (err) {
      console.error("[cron] github error", err.message);
    }
  });
}

module.exports = { schedule };
