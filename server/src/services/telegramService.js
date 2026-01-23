import axios from "axios";
import logger from "../utils/logger.js";

/**
 * Telegram Service - Sends notifications to a Telegram Bot
 */
export const telegramService = {
    /**
     * Send a message to the configured Telegram chat
     * @param {string} text - Message text (supports MarkdownV2)
     */
    async sendMessage(text) {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!token || !chatId) {
            logger.warn("Telegram notifications skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set");
            return false;
        }

        try {
            const url = `https://api.telegram.org/bot${token}/sendMessage`;
            await axios.post(url, {
                chat_id: chatId,
                text,
                parse_mode: "HTML", // HTML is easier to format than MarkdownV2
                disable_web_page_preview: true
            });
            return true;
        } catch (error) {
            logger.error("Failed to send Telegram message", {
                error: error.response?.data || error.message
            });
            return false;
        }
    },

    /**
     * Send a formatted sync report
     * @param {object} results - Sync results object
     */
    async sendSyncReport(results) {
        const { schedule, sync, contests, executionMs } = results;

        const timeStr = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        const durationSec = (executionMs / 1000).toFixed(1);

        const message = `
<b>🚀 DevLog Sync Report</b>
📅 <i>${timeStr}</i>

<b>--- Queue Summary ---</b>
📦 Total Jobs: ${schedule?.total || 0}
✅ Newly Queued: ${schedule?.queued || 0}
⏭️ Already Synced: ${schedule?.alreadyQueued || 0}

<b>--- Sync Execution ---</b>
⚙️ Processed: ${sync?.processed || 0}
✅ Succeeded: ${sync?.succeeded || 0}
❌ Failed: ${sync?.failed || 0}
⚠️ Errors: ${sync?.errors?.length || 0}

<b>--- Contests ---</b>
🏆 Total Fetched: ${contests?.totalFetched || 0}
📶 LC: ${contests?.platforms?.leetcode?.fetched || 0} | CF: ${contests?.platforms?.codeforces?.fetched || 0}
📶 CC: ${contests?.platforms?.codechef?.fetched || 0} | AC: ${contests?.platforms?.atcoder?.fetched || 0}

⏱️ <b>Duration:</b> ${durationSec}s
    `.trim();

        return this.sendMessage(message);
    }
};

export default telegramService;
