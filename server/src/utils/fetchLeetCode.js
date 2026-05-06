import axios from "axios";
import logger from "./logger.js";

export const fetchLeetCode = async (username) => {
  const query = `
    query userProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          realName
          userAvatar
          ranking
          reputation
          websites
          countryName
          company
          school
          aboutMe
          starRating
        }
        submitStats {
          acSubmissionNum { difficulty count submissions }
          totalSubmissionNum { difficulty count submissions }
        }
        badges { id displayName icon }
        activeBadge { id displayName icon }
        languageProblemCount { languageName problemsSolved }
      }
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        topPercentage
      }
      userContestRankingHistory(username: $username) {
        attended rating ranking
        contest { title startTime }
      }
      recentAcSubmissionList(username: $username, limit: 12) {
        title titleSlug timestamp
      }
    }
  `;

  const headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Content-Type": "application/json",
    "Referer": "https://leetcode.com/",
    "Origin": "https://leetcode.com",
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.9"
  };

  try {
    const res = await axios.post("https://leetcode.com/graphql", {
      query,
      variables: { username },
    }, { headers, timeout: 30000 });

    const { data, errors } = res.data;
    if (errors) {
      logger.warn(`LC GraphQL Errors [${username}]:`, { errors: errors.map(e => e.message) });
    }

    if (!data?.matchedUser) {
      return { error: `User "${username}" not found or private profile.` };
    }

    const user = data.matchedUser;
    const profile = user.profile || {};
    const acs = user.submitStats?.acSubmissionNum || [];
    const totals = user.submitStats?.totalSubmissionNum || [];

    const submissionsByDifficulty = {
      easy: { solved: 0, total: 0 },
      medium: { solved: 0, total: 0 },
      hard: { solved: 0, total: 0 },
      all: { solved: 0, total: 0 }
    };

    acs.forEach(i => {
      const d = i.difficulty.toLowerCase();
      if (submissionsByDifficulty[d]) submissionsByDifficulty[d].solved = i.count;
    });
    totals.forEach(i => {
      const d = i.difficulty.toLowerCase();
      if (submissionsByDifficulty[d]) submissionsByDifficulty[d].total = i.count;
    });

    return {
      username: user.username,
      realName: profile.realName || user.username,
      avatar: profile.userAvatar,
      ranking: profile.ranking,
      reputation: profile.reputation,
      totalSolved: submissionsByDifficulty.all.solved,
      submissionsByDifficulty,
      contestRanking: data.userContestRanking || {},
      contestHistory: (data.userContestRankingHistory || []).filter(h => h.attended).slice(-10),
      recentSubmissions: data.recentAcSubmissionList || [],
      languageStats: user.languageProblemCount || [],
      badges: user.badges || [],
      activeBadge: user.activeBadge,
      aboutMe: profile.aboutMe,
      countryName: profile.countryName
    };
  } catch (err) {
    logger.error(`LC Fetch Error [${username}]:`, { error: err.message });
    return { error: `Network Error: ${err.message}` };
  }
};

export default fetchLeetCode;
