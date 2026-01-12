import Contest from "../models/Contest.js";
import axios from "axios";

/**
 * Contest Service - Aggregated contests from multiple platforms
 */
export const contestService = {
  /**
   * Get upcoming contests with optional filters
   */
  async getUpcomingContests(options = {}) {
    const { 
      platforms = ["leetcode", "codeforces", "codechef", "atcoder"],
      limit = 50,
      days = 30 
    } = options;

    const now = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    const contests = await Contest.find({
      platform: { $in: platforms },
      startTime: { $gte: now, $lte: endDate }
    })
      .sort({ startTime: 1 })
      .limit(limit);

    return contests;
  },

  /**
   * Get contests by platform
   */
  async getContestsByPlatform(platform, options = {}) {
    const { limit = 20, includeOngoing = true } = options;

    const now = new Date();
    const query = { platform };

    if (!includeOngoing) {
      query.startTime = { $gte: now };
    } else {
      query.$or = [
        { startTime: { $gte: now } },
        { endTime: { $gte: now } }
      ];
    }

    return Contest.find(query)
      .sort({ startTime: 1 })
      .limit(limit);
  },

  /**
   * Fetch and update all contests (cron job)
   */
  async fetchAllContests() {
    const results = {
      leetcode: { fetched: 0, error: null },
      codeforces: { fetched: 0, error: null },
      codechef: { fetched: 0, error: null },
      atcoder: { fetched: 0, error: null }
    };

    // Fetch from each platform with delays
    try {
      results.codeforces = await this.fetchCodeforcesContests();
    } catch (error) {
      results.codeforces.error = error.message;
    }

    await this.delay(1000);

    try {
      results.leetcode = await this.fetchLeetCodeContests();
    } catch (error) {
      results.leetcode.error = error.message;
    }

    await this.delay(1000);

    try {
      results.codechef = await this.fetchCodeChefContests();
    } catch (error) {
      results.codechef.error = error.message;
    }

    await this.delay(1000);

    try {
      results.atcoder = await this.fetchAtCoderContests();
    } catch (error) {
      results.atcoder.error = error.message;
    }

    // Cleanup old contests
    await this.cleanupExpiredContests();

    return results;
  },

  /**
   * Fetch Codeforces contests
   */
  async fetchCodeforcesContests() {
    const response = await axios.get("https://codeforces.com/api/contest.list", {
      timeout: 10000
    });

    if (response.data.status !== "OK") {
      throw new Error("Codeforces API returned error");
    }

    const now = Date.now() / 1000;
    const upcomingContests = response.data.result
      .filter(c => c.phase === "BEFORE" || (c.phase === "CODING" && c.relativeTimeSeconds < 0))
      .slice(0, 20);

    let fetched = 0;
    for (const contest of upcomingContests) {
      const startTime = new Date(contest.startTimeSeconds * 1000);
      const endTime = new Date(startTime.getTime() + contest.durationSeconds * 1000);

      await Contest.findOneAndUpdate(
        { platform: "codeforces", contestId: contest.id.toString() },
        {
          $set: {
            name: contest.name,
            startTime,
            endTime,
            duration: Math.round(contest.durationSeconds / 60),
            url: `https://codeforces.com/contest/${contest.id}`,
            division: this.extractCFDivision(contest.name),
            rated: true,
            fetchedAt: new Date()
          }
        },
        { upsert: true }
      );
      fetched++;
    }

    return { fetched, error: null };
  },

  /**
   * Fetch LeetCode contests
   */
  async fetchLeetCodeContests() {
    const query = `
      query {
        topTwoContests {
          title
          startTime
          duration
          titleSlug
        }
      }
    `;

    const response = await axios.post(
      "https://leetcode.com/graphql",
      { query },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 10000
      }
    );

    const contests = response.data?.data?.topTwoContests || [];
    let fetched = 0;

    for (const contest of contests) {
      const startTime = new Date(contest.startTime * 1000);
      const endTime = new Date(startTime.getTime() + contest.duration * 1000);

      await Contest.findOneAndUpdate(
        { platform: "leetcode", contestId: contest.titleSlug },
        {
          $set: {
            name: contest.title,
            startTime,
            endTime,
            duration: Math.round(contest.duration / 60),
            url: `https://leetcode.com/contest/${contest.titleSlug}`,
            rated: true,
            fetchedAt: new Date()
          }
        },
        { upsert: true }
      );
      fetched++;
    }

    return { fetched, error: null };
  },

  /**
   * Fetch CodeChef contests
   */
  async fetchCodeChefContests() {
    try {
      const response = await axios.get(
        "https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all",
        { timeout: 10000 }
      );

      const futureContests = response.data?.future_contests || [];
      const presentContests = response.data?.present_contests || [];
      const allContests = [...presentContests, ...futureContests].slice(0, 20);

      let fetched = 0;
      for (const contest of allContests) {
        const startTime = new Date(contest.contest_start_date_iso);
        const endTime = new Date(contest.contest_end_date_iso);
        const durationMs = endTime - startTime;

        await Contest.findOneAndUpdate(
          { platform: "codechef", contestId: contest.contest_code },
          {
            $set: {
              name: contest.contest_name,
              startTime,
              endTime,
              duration: Math.round(durationMs / 60000),
              url: `https://www.codechef.com/${contest.contest_code}`,
              rated: true,
              fetchedAt: new Date()
            }
          },
          { upsert: true }
        );
        fetched++;
      }

      return { fetched, error: null };
    } catch (error) {
      // CodeChef API can be flaky, don't fail the whole job
      return { fetched: 0, error: error.message };
    }
  },

  /**
   * Fetch AtCoder contests
   */
  async fetchAtCoderContests() {
    try {
      // AtCoder doesn't have a public API, use a community API
      const response = await axios.get(
        "https://kenkoooo.com/atcoder/resources/contests.json",
        { timeout: 10000 }
      );

      const now = Date.now() / 1000;
      const upcomingContests = response.data
        .filter(c => c.start_epoch_second > now)
        .sort((a, b) => a.start_epoch_second - b.start_epoch_second)
        .slice(0, 20);

      let fetched = 0;
      for (const contest of upcomingContests) {
        const startTime = new Date(contest.start_epoch_second * 1000);
        const endTime = new Date(startTime.getTime() + contest.duration_second * 1000);

        await Contest.findOneAndUpdate(
          { platform: "atcoder", contestId: contest.id },
          {
            $set: {
              name: contest.title,
              startTime,
              endTime,
              duration: Math.round(contest.duration_second / 60),
              url: `https://atcoder.jp/contests/${contest.id}`,
              rated: contest.rate_change !== "-",
              fetchedAt: new Date()
            }
          },
          { upsert: true }
        );
        fetched++;
      }

      return { fetched, error: null };
    } catch (error) {
      return { fetched: 0, error: error.message };
    }
  },

  /**
   * Extract Codeforces division from contest name
   */
  extractCFDivision(name) {
    if (name.includes("Div. 1 + 2") || name.includes("Div. 1+2")) return "Div. 1 + 2";
    if (name.includes("Div. 1")) return "Div. 1";
    if (name.includes("Div. 2")) return "Div. 2";
    if (name.includes("Div. 3")) return "Div. 3";
    if (name.includes("Div. 4")) return "Div. 4";
    if (name.includes("Educational")) return "Educational";
    if (name.includes("Global")) return "Global";
    return null;
  },

  /**
   * Cleanup expired contests (older than 24 hours)
   */
  async cleanupExpiredContests() {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - 24);

    const result = await Contest.deleteMany({
      endTime: { $lt: cutoff }
    });

    return result.deletedCount;
  },

  /**
   * Delay helper
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

export default contestService;
