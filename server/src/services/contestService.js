import Contest from "../models/Contest.js";
import axios from "axios";
import * as cheerio from "cheerio";
import {
  CODEFORCES_CONTEST_LIST,
  CODEFORCES_CONTEST_URL,
  LEETCODE_GRAPHQL,
  LEETCODE_CONTEST_URL,
  CODECHEF_CONTEST_LIST,
  CODECHEF_CONTEST_URL,
  CLIST_CONTESTS,
  ATCODER_CONTESTS,
  ATCODER_BASE
} from "../utils/links.js";

import logger from "../utils/logger.js";

const logError = (platform, err) => logger.error(`[ContestService] ${platform} error:`, { error: err.message });

export const contestService = {
  async save(platform, contestId, data) {
    return Contest.findOneAndUpdate(
      { platform, contestId: contestId.toString() },
      { $set: { ...data, fetchedAt: new Date() } },
      { upsert: true }
    );
  },

  async getUpcomingContests({ platforms = ["leetcode", "codeforces", "codechef", "atcoder"], limit = 50, days = 60 } = {}) {
    const now = new Date();
    const end = new Date();
    end.setDate(end.getDate() + days);

    return Contest.find({
      platform: { $in: platforms },
      endTime: { $gte: now },
      startTime: { $lte: end }
    }).sort({ startTime: 1 }).limit(limit);
  },

  async fetchAllContests() {
    const platforms = ["codeforces", "leetcode", "codechef", "atcoder"];
    const results = {};
    for (const p of platforms) {
      try {
        results[p] = await contestService[`fetch${p.charAt(0).toUpperCase() + p.slice(1)}Contests`]();
        await new Promise(r => setTimeout(r, 1000));
      } catch (err) {
        logError(p, err);
        results[p] = { fetched: 0, error: err.message };
      }
    }
    await this.cleanup();
    return results;
  },

  async fetchCodeforcesContests() {
    const res = await axios.get(CODEFORCES_CONTEST_LIST, { timeout: 10000 });
    const upcoming = res.data.result.filter(c => c.phase === "BEFORE" || (c.phase === "CODING" && c.relativeTimeSeconds < 0)).slice(0, 20);
    for (const c of upcoming) {
      const start = new Date(c.startTimeSeconds * 1000);
      await this.save("codeforces", c.id, {
        name: c.name, startTime: start, endTime: new Date(start.getTime() + c.durationSeconds * 1000),
        duration: Math.round(c.durationSeconds / 60), url: CODEFORCES_CONTEST_URL(c.id),
        division: this.extractCFDiv(c.name), rated: true
      });
    }
    return { fetched: upcoming.length };
  },

  async fetchLeetcodeContests() {
    const query = `query { topTwoContests { title startTime duration titleSlug } }`;
    const res = await axios.post(LEETCODE_GRAPHQL, { query }, { timeout: 10000 });
    const contests = res.data?.data?.topTwoContests || [];
    for (const c of contests) {
      const start = new Date(c.startTime * 1000);
      await this.save("leetcode", c.titleSlug, {
        name: c.title, startTime: start, endTime: new Date(start.getTime() + c.duration * 1000),
        duration: Math.round(c.duration / 60), url: LEETCODE_CONTEST_URL(c.titleSlug), rated: true
      });
    }
    return { fetched: contests.length };
  },

  async fetchCodechefContests() {
    const res = await axios.get(CODECHEF_CONTEST_LIST, { timeout: 10000 });
    const list = [...(res.data?.present_contests || []), ...(res.data?.future_contests || [])].slice(0, 20);
    for (const c of list) {
      const start = new Date(c.contest_start_date_iso), end = new Date(c.contest_end_date_iso);
      await this.save("codechef", c.contest_code, {
        name: c.contest_name, startTime: start, endTime: end,
        duration: Math.round((end - start) / 60000), url: CODECHEF_CONTEST_URL(c.contest_code), rated: true
      });
    }
    return { fetched: list.length };
  },

  async fetchAtcoderContests() {
    try {
      const res = await axios.get(CLIST_CONTESTS, {
        params: { upcoming: true, resource: "atcoder.jp", order_by: "start", limit: 20 },
        headers: { "Authorization": `ApiKey ${process.env.CLIST_API_KEY || ""}` },
        timeout: 10000
      });
      const list = res.data?.objects || [];
      for (const c of list) {
        const start = new Date(c.start), end = new Date(c.end);
        await this.save("atcoder", c.id, {
          name: c.event, startTime: start, endTime: end, duration: Math.round((end - start) / 60000),
          url: c.href, rated: true
        });
      }
      return { fetched: list.length };
    } catch (err) {
      // Fallback: Scrape AtCoder official site (Kenkoooo API is often delayed for upcoming contests)
      try {
        const res = await axios.get(ATCODER_CONTESTS, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; DevLogBot/1.0)" },
          timeout: 10000
        });
        const $ = cheerio.load(res.data);
        const contests = [];

        const parseRow = (row) => {
          const cols = $(row).find("td");
          if (cols.length === 0) return;

          let timeStr = $(cols[0]).find("a").text();
          if (!timeStr) timeStr = $(cols[0]).text();

          const nameEl = $(cols[1]).find("a").first();
          const name = nameEl.text();
          const urlPath = nameEl.attr("href");
          const url = ATCODER_BASE + urlPath;

          const durationStr = $(cols[2]).text(); // "HH:mm"
          const ratedRange = $(cols[3]).text();

          if (!name) return;

          let durationMinutes = 0;
          if (durationStr.includes(":")) {
            const parts = durationStr.split(":");
            if (parts.length === 2) {
              durationMinutes = parseInt(parts[0]) * 60 + parseInt(parts[1]);
            }
          }

          const start = new Date(timeStr);
          if (isNaN(start.getTime())) return;

          const end = new Date(start.getTime() + durationMinutes * 60000);
          const id = urlPath.split("/").pop();

          contests.push({
            contestId: id,
            name,
            url,
            startTime: start,
            endTime: end,
            duration: durationMinutes,
            rated: ratedRange.trim() !== "-"
          });
        };

        const activeH3 = $('h3:contains("Active Contests")');
        if (activeH3.length) {
          activeH3.nextAll("div").first().find("table tbody tr").each((i, row) => parseRow(row));
        }

        const upcomingH3 = $('h3:contains("Upcoming Contests")');
        if (upcomingH3.length) {
          upcomingH3.nextAll("div").first().find("table tbody tr").each((i, row) => parseRow(row));
        }

        for (const c of contests) {
          await this.save("atcoder", c.contestId, c);
        }
        return { fetched: contests.length };
      } catch (scrapeErr) {
        throw new Error(`AtCoder fetch failed: ${scrapeErr.message}`);
      }
    }
  },

  extractCFDiv(name) {
    const divs = ["Div. 1 + 2", "Div. 1+2", "Div. 1", "Div. 2", "Div. 3", "Div. 4", "Educational", "Global"];
    return divs.find(d => name.includes(d)) || null;
  },

  async cleanup() {
    const cutoff = new Date(Date.now() - 24 * 3600000);
    return Contest.deleteMany({ endTime: { $lt: cutoff } });
  }
};

export default contestService;
