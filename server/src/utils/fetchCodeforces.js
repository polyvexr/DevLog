import axios from "axios";

export const fetchCodeforces = async (username) => {
  try {
    // Fetch user info
    const userInfoRes = await axios.get(
      `https://codeforces.com/api/user.info?handles=${username}`,
      { timeout: 15000 }
    );

    if (userInfoRes.data.status !== "OK") return {};

    const user = userInfoRes.data.result[0];

    // Fetch user submissions
    let submissionStats = {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
      problemsSolved: 0,
      problemsByRating: {},
      languagesUsed: {},
      verdictDistribution: {},
    };

    try {
      const submissionsRes = await axios.get(
        `https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000`
      );

      if (submissionsRes.data.status === "OK") {
        const submissions = submissionsRes.data.result;
        submissionStats.totalSubmissions = submissions.length;

        const solvedProblems = new Set();
        const problemRatings = {};
        const languages = {};
        const verdicts = {};

        submissions.forEach((submission) => {
          // Count verdicts
          const verdict = submission.verdict || "UNKNOWN";
          verdicts[verdict] = (verdicts[verdict] || 0) + 1;

          if (verdict === "OK") {
            submissionStats.acceptedSubmissions++;
            const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
            solvedProblems.add(problemId);

            // Count problems by rating
            const rating = submission.problem.rating || "Unrated";
            problemRatings[rating] = (problemRatings[rating] || 0) + 1;
          }

          // Count languages
          const lang = submission.programmingLanguage;
          languages[lang] = (languages[lang] || 0) + 1;
        });

        submissionStats.problemsSolved = solvedProblems.size;
        submissionStats.problemsByRating = problemRatings;
        submissionStats.languagesUsed = languages;
        submissionStats.verdictDistribution = verdicts;
      }
    } catch (err) {
      console.log("CF Submissions Fetch Error:", err.message);
    }

    // Fetch user rating history
    let ratingHistory = {
      totalContests: 0,
      bestContestRank: null,
      worstContestRank: null,
      averageRank: 0,
      ratingChanges: [],
    };

    try {
      const ratingRes = await axios.get(
        `https://codeforces.com/api/user.rating?handle=${username}`
      );

      if (ratingRes.data.status === "OK") {
        const contests = ratingRes.data.result;
        ratingHistory.totalContests = contests.length;

        if (contests.length > 0) {
          let totalRank = 0;
          let bestRank = contests[0].rank;
          let worstRank = contests[0].rank;

          contests.forEach((contest) => {
            totalRank += contest.rank;
            if (contest.rank < bestRank) bestRank = contest.rank;
            if (contest.rank > worstRank) worstRank = contest.rank;

            ratingHistory.ratingChanges.push({
              contestName: contest.contestName,
              rank: contest.rank,
              oldRating: contest.oldRating,
              newRating: contest.newRating,
              ratingChange: contest.newRating - contest.oldRating,
            });
          });

          ratingHistory.bestContestRank = bestRank;
          ratingHistory.worstContestRank = worstRank;
          ratingHistory.averageRank = Math.round(totalRank / contests.length);
        }
      }
    } catch (err) {
      console.log("CF Rating Fetch Error:", err.message);
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
      registrationTime: user.registrationTimeSeconds
        ? new Date(user.registrationTimeSeconds * 1000).toISOString()
        : null,
      lastOnlineTime: user.lastOnlineTimeSeconds
        ? new Date(user.lastOnlineTimeSeconds * 1000).toISOString()
        : null,
      avatar: user.avatar || user.titlePhoto || "",

      // Submission statistics
      ...submissionStats,

      // Rating history
      ...ratingHistory,
    };
  } catch (err) {
    console.log("CF Fetch Error:", err.message);
    return {};
  }
};
