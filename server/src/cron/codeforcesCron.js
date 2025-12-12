const cron = require("node-cron");
const fetchCodeforces = require("../utils/fetchCodeforces");

function schedule() {
  cron.schedule("0 * * * *", async () => {
    try {
      console.log("[cron] codeforces cron running");
      const data = await fetchCodeforces();
      console.log("[cron] codeforces fetched:", Object.keys(data || {}).length);
    } catch (err) {
      console.error("[cron] codeforces error", err.message);
    }
  });
}

module.exports = { schedule };
