import Contest from "../models/Contest.js";
import axios from "axios";

const logError = (platform, err) => console.error(`[ContestService] ${platform} error:`, err.message);

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
        results[p] = await this[`fetch${p.charAt(0).toUpperCase() + p.slice(1)}Contests`]();
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
    const res = await axios.get("https://codeforces.com/api/contest.list", { timeout: 10000 });
    const upcoming = res.data.result.filter(c => c.phase === "BEFORE" || (c.phase === "CODING" && c.relativeTimeSeconds < 0)).slice(0, 20);
    for (const c of upcoming) {
      const start = new Date(c.startTimeSeconds * 1000);
      await this.save("codeforces", c.id, {
        name: c.name, startTime: start, endTime: new Date(start.getTime() + c.durationSeconds * 1000),
        duration: Math.round(c.durationSeconds / 60), url: `https://codeforces.com/contest/${c.id}`,
        division: this.extractCFDiv(c.name), rated: true
      });
    }
    return { fetched: upcoming.length };
  },

  async fetchLeetCodeContests() {
    const query = `query { topTwoContests { title startTime duration titleSlug } }`;
    const res = await axios.post("https://leetcode.com/graphql", { query }, { timeout: 10000 });
    const contests = res.data?.data?.topTwoContests || [];
    for (const c of contests) {
      const start = new Date(c.startTime * 1000);
      await this.save("leetcode", c.titleSlug, {
        name: c.title, startTime: start, endTime: new Date(start.getTime() + c.duration * 1000),
        duration: Math.round(c.duration / 60), url: `https://leetcode.com/contest/${c.titleSlug}`, rated: true
      });
    }
    return { fetched: contests.length };
  },

  async fetchCodeChefContests() {
    const res = await axios.get("https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all", { timeout: 10000 });
    const list = [...(res.data?.present_contests || []), ...(res.data?.future_contests || [])].slice(0, 20);
    for (const c of list) {
      const start = new Date(c.contest_start_date_iso), end = new Date(c.contest_end_date_iso);
      await this.save("codechef", c.contest_code, {
        name: c.contest_name, startTime: start, endTime: end,
        duration: Math.round((end - start) / 60000), url: `https://www.codechef.com/${c.contest_code}`, rated: true
      });
    }
    return { fetched: list.length };
  },

  async fetchAtCoderContests() {
    try {
      const res = await axios.get("https://clist.by/api/v4/contest/", {
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
    } catch {
      const res = await axios.get("https://kenkoooo.com/atcoder/resources/contests.json", { timeout: 10000 });
      const now = Date.now() / 1000;
      const upcoming = res.data.filter(c => c.start_epoch_second > now - 3600).sort((a, b) => a.start_epoch_second - b.start_epoch_second).slice(0, 20);
      for (const c of upcoming) {
        const start = new Date(c.start_epoch_second * 1000);
        await this.save("atcoder", c.id, {
          name: c.title, startTime: start, endTime: new Date(start.getTime() + c.duration_second * 1000),
          duration: Math.round(c.duration_second / 60), url: `https://atcoder.jp/contests/${c.id}`, rated: c.rate_change !== "-"
        });
      }
      return { fetched: upcoming.length };
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
