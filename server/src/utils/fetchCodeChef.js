import axios from "axios";

/**
 * Fetch CodeChef user statistics
 * Uses multiple API endpoints with fallback chain
 */
export const fetchCodeChef = async (username) => {
  // Try multiple APIs in order of reliability
  const apis = [
    () => fetchFromCPRatingAPI(username),
    () => fetchFromCodeChefAPIGitHub(username),
    () => fetchFromOriginalAPI(username),
  ];

  for (const fetchFn of apis) {
    try {
      const data = await fetchFn();
      if (data && Object.keys(data).length > 0 && (data.rating || data.username)) {
        console.log("CodeChef data fetched successfully");
        return data;
      }
    } catch (err) {
      console.log("CodeChef API attempt failed:", err.message);
      continue;
    }
  }

  console.log("All CodeChef APIs failed for:", username);
  return {};
};

/**
 * CP Rating API - Most reliable
 * https://cp-rating-api.vercel.app/codechef/{username}
 */
async function fetchFromCPRatingAPI(username) {
  const response = await axios.get(
    `https://cp-rating-api.vercel.app/codechef/${username}`,
    { timeout: 15000 }
  );

  const data = response.data;
  if (!data || data.error) {
    throw new Error("User not found");
  }

  // Process contests array for rating history
  const ratingHistory = (data.contests || []).slice(-20).map(contest => ({
    contestCode: contest.code || contest.name,
    contestName: contest.name,
    rating: contest.rating,
    rank: contest.rank,
    date: contest.date,
  }));

  return {
    username: data.username || username,
    name: data.name || "",
    stars: parseInt(data.stars) || 0,
    rating: data.rating || 0,
    highestRating: data.highestRating || data.rating || 0,
    countryName: data.country || "",
    globalRank: data.globalRank || null,
    countryRank: data.countryRank || null,
    totalSolved: data.problemsSolved || 0,
    partialSolved: data.partialProblems || 0,
    problemsSolved: {
      easy: 0,
      medium: 0,
      hard: 0,
      challenge: 0,
      peer: 0,
    },
    contestsParticipated: (data.contests || []).length,
    ratingHistory,
    division: data.division || null,
    badges: [],
    avatar: data.avatar || null,
  };
}

/**
 * Yash2003Bisht CodeChef API
 * https://codechef-api.vercel.app/user-stats/{username}
 */
async function fetchFromCodeChefAPIGitHub(username) {
  const response = await axios.get(
    `https://codechef-api.vercel.app/handle/${username}`,
    { timeout: 15000 }
  );

  const data = response.data;
  if (!data || data.success === false || data.status === "Failed") {
    throw new Error("User not found");
  }

  // Process rating data
  const ratingHistory = (data.ratingData || []).slice(-20).map(item => ({
    contestCode: item.code,
    contestName: item.name,
    rating: item.rating,
    rank: item.rank,
    date: item.end_date,
  }));

  return {
    username: data.username || username,
    name: data.name || "",
    stars: data.stars ? parseInt(data.stars.replace("★", "")) : 0,
    rating: data.currentRating || data.rating || 0,
    highestRating: data.highestRating || 0,
    countryName: data.countryName || "",
    globalRank: data.globalRank || null,
    countryRank: data.countryRank || null,
    totalSolved: data.fullySolved?.count || 0,
    partialSolved: data.partiallySolved?.count || 0,
    problemsSolved: {
      easy: 0,
      medium: 0,
      hard: 0,
      challenge: 0,
      peer: 0,
    },
    contestsParticipated: ratingHistory.length,
    ratingHistory,
    division: data.division || null,
    badges: data.badges || [],
    avatar: data.profile || null,
  };
}

/**
 * Original fallback API
 */
async function fetchFromOriginalAPI(username) {
  const response = await axios.get(
    `https://codechef-api.onrender.com/handle/${username}`,
    { timeout: 20000 }
  );

  const data = response.data;
  if (!data || data.success === false) {
    throw new Error("User not found");
  }

  const ratingHistory = (data.ratingData || []).slice(-20).map(item => ({
    contestCode: item.code,
    contestName: item.name,
    rating: item.rating,
    rank: item.rank,
    date: item.end_date,
  }));

  return {
    username: data.username || username,
    name: data.name || "",
    stars: data.stars || 0,
    rating: data.currentRating || 0,
    highestRating: data.highestRating || 0,
    countryName: data.countryName || "",
    globalRank: data.globalRank || null,
    countryRank: data.countryRank || null,
    totalSolved: data.fullySolved?.count || 0,
    partialSolved: data.partiallySolved?.count || 0,
    problemsSolved: {
      easy: 0,
      medium: 0,
      hard: 0,
      challenge: 0,
      peer: 0,
    },
    contestsParticipated: ratingHistory.length,
    ratingHistory,
    division: null,
    badges: [],
  };
}

export default fetchCodeChef;
