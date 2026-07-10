import axios from "axios";
import logger from "./logger.js";
import {
  CODEFORCES_USER_INFO,
  CODEFORCES_USER_STATUS,
  CODEFORCES_USER_RATING
} from "./links.js";

export const fetchCodeforces = async (username) => {
  try {
    // Parallel fetch all CF data
    const [userInfoRes, submissionsRes, ratingRes] = await Promise.all([
      axios.get(CODEFORCES_USER_INFO(username), { timeout: 15000 }).catch(err => err.response),
      axios.get(CODEFORCES_USER_STATUS(username), { timeout: 20000 }).catch(err => err.response),
      axios.get(CODEFORCES_USER_RATING(username), { timeout: 15000 }).catch(err => err.response),
    ]);

    if (!userInfoRes || userInfoRes.data?.status !== "OK") {
      return { error: "User not found or API error" };
    }

    const user = userInfoRes.data.result[0];

    // Process submissions
    const submissionStats = {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
      problemsSolved: 0,
      problemsByRating: {},
      languagesUsed: {},
      verdictDistribution: {},
    };

    if (submissionsRes?.data?.status === "OK") {
      const submissions = submissionsRes.data.result;
      submissionStats.totalSubmissions = submissions.length;

      const solvedProblems = new Set();
      submissions.forEach((sub) => {
        const verdict = sub.verdict || "UNKNOWN";
        submissionStats.verdictDistribution[verdict] = (submissionStats.verdictDistribution[verdict] || 0) + 1;

        if (verdict === "OK") {
          submissionStats.acceptedSubmissions++;
          solvedProblems.add(`${sub.problem.contestId}-${sub.problem.index}`);

          const rating = sub.problem.rating || "Unrated";
          submissionStats.problemsByRating[rating] = (submissionStats.problemsByRating[rating] || 0) + 1;
        }

        const lang = sub.programmingLanguage;
        submissionStats.languagesUsed[lang] = (submissionStats.languagesUsed[lang] || 0) + 1;
      });

      submissionStats.problemsSolved = solvedProblems.size;
    }

    // Process rating history
    const ratingHistory = {
      totalContests: 0,
      bestContestRank: null,
      worstContestRank: null,
      averageRank: 0,
      ratingChanges: [],
    };

    if (ratingRes?.data?.status === "OK") {
      const contests = ratingRes.data.result;
      ratingHistory.totalContests = contests.length;

      if (contests.length > 0) {
        let totalRank = 0;
        let bestRank = Infinity;
        let worstRank = -Infinity;

        ratingHistory.ratingChanges = contests.map((c) => {
          totalRank += c.rank;
          bestRank = Math.min(bestRank, c.rank);
          worstRank = Math.max(worstRank, c.rank);

          return {
            contestName: c.contestName,
            rank: c.rank,
            oldRating: c.oldRating,
            newRating: c.newRating,
            ratingChange: c.newRating - c.oldRating,
          };
        });

        ratingHistory.bestContestRank = bestRank;
        ratingHistory.worstContestRank = worstRank;
        ratingHistory.averageRank = Math.round(totalRank / contests.length);
      }
    }

    return {
      // Basic user info
      rating: user.rating || 0,
      maxRating: user.maxRating || 0,
      rank: user.rank || "unrated",
      maxRank: user.maxRank || "unrated",
      friendOfCount: user.friendOfCount || 0,
      contribution: user.contribution || 0,
      organization: user.organization || "",
      country: user.country || "",
      city: user.city || "",
      registrationTime: user.registrationTimeSeconds ? new Date(user.registrationTimeSeconds * 1000).toISOString() : null,
      lastOnlineTime: user.lastOnlineTimeSeconds ? new Date(user.lastOnlineTimeSeconds * 1000).toISOString() : null,
      avatar: user.avatar || user.titlePhoto || "",

      ...submissionStats,
      ...ratingHistory,
    };
  } catch (err) {
    logger.error(`CF Fetch Error [${username}]:`, { error: err.message });
    return { error: err.message };
  }
};

