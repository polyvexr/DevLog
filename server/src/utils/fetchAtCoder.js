import axios from "axios";

/**
 * Fetch AtCoder user statistics
 * Uses AtCoder Problems API and AtCoder official API
 */
export const fetchAtCoder = async (username) => {
  try {
    // Fetch user info and contest history in parallel
    const [userInfoRes, contestHistoryRes, solvedProblemsRes] = await Promise.all([
      axios.get(`https://atcoder.jp/users/${username}/history/json`, { timeout: 15000 }).catch(() => ({ data: [] })),
      axios.get(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/ac_rank?user=${username}`, { timeout: 15000 }).catch(() => ({ data: null })),
      axios.get(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${username}&from_second=0`, { timeout: 15000 }).catch(() => ({ data: [] })),
    ]);

    const contestHistory = userInfoRes.data || [];
    const acRank = contestHistoryRes.data;
    const submissions = solvedProblemsRes.data || [];

    // Get latest rating from contest history
    const latestContest = contestHistory[contestHistory.length - 1];
    const currentRating = latestContest?.NewRating || 0;
    const highestRating = Math.max(...contestHistory.map(c => c.NewRating || 0), 0);

    // Calculate problems solved by processing submissions
    const solvedProblems = new Set();
    const solvedByDifficulty = {
      gray: 0,     // 0-399
      brown: 0,    // 400-799
      green: 0,    // 800-1199
      cyan: 0,     // 1200-1599
      blue: 0,     // 1600-1999
      yellow: 0,   // 2000-2399
      orange: 0,   // 2400-2799
      red: 0,      // 2800+
    };

    submissions.forEach(sub => {
      if (sub.result === "AC") {
        solvedProblems.add(sub.problem_id);
      }
    });

    // Get problem difficulties from AtCoder Problems API (can be slow)
    try {
      const difficultyRes = await axios.get(
        `https://kenkoooo.com/atcoder/resources/problem-models.json`,
        { timeout: 5000 } // Reduced to 5s to avoid sync timeouts
      );
      const difficulties = difficultyRes.data || {};

      solvedProblems.forEach(problemId => {
        const diff = difficulties[problemId]?.difficulty || 0;
        if (diff < 400) solvedByDifficulty.gray++;
        else if (diff < 800) solvedByDifficulty.brown++;
        else if (diff < 1200) solvedByDifficulty.green++;
        else if (diff < 1600) solvedByDifficulty.cyan++;
        else if (diff < 2000) solvedByDifficulty.blue++;
        else if (diff < 2400) solvedByDifficulty.yellow++;
        else if (diff < 2800) solvedByDifficulty.orange++;
        else solvedByDifficulty.red++;
      });
    } catch (diffErr) {
      console.log("AtCoder difficulty fetch failed:", diffErr.message);
    }

    // Process contest history for display
    const ratingHistory = contestHistory.slice(-20).map(contest => ({
      contestName: contest.ContestName,
      contestScreenName: contest.ContestScreenName,
      place: contest.Place,
      oldRating: contest.OldRating,
      newRating: contest.NewRating,
      performance: contest.Performance,
      date: contest.EndTime,
    }));

    // Calculate rank color based on rating
    const getRankColor = (rating) => {
      if (rating >= 2800) return "red";
      if (rating >= 2400) return "orange";
      if (rating >= 2000) return "yellow";
      if (rating >= 1600) return "blue";
      if (rating >= 1200) return "cyan";
      if (rating >= 800) return "green";
      if (rating >= 400) return "brown";
      return "gray";
    };

    return {
      // Basic profile
      username,
      rating: currentRating,
      highestRating,
      rankColor: getRankColor(currentRating),

      // Ranking
      acRank: acRank?.rank || null,
      acCount: acRank?.count || solvedProblems.size,

      // Problem solving stats
      totalSolved: solvedProblems.size,
      solvedByDifficulty,

      // Contest participation
      contestsParticipated: contestHistory.length,
      ratingHistory,

      // Performance stats
      averagePerformance: contestHistory.length > 0
        ? Math.round(contestHistory.reduce((sum, c) => sum + (c.Performance || 0), 0) / contestHistory.length)
        : 0,
      bestPerformance: contestHistory.length > 0
        ? Math.max(...contestHistory.map(c => c.Performance || 0))
        : 0,
    };
  } catch (err) {
    console.log("AtCoder Fetch Error:", err.message);
    return {};
  }
};

export default fetchAtCoder;
