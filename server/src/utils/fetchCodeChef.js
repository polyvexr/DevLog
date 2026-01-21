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
 * Normalize CodeChef data from any API response to consistent format
 */
function normalizeCodeChefData(data, username) {
  // Extract stars value (can be number or string like "3★")
  const parseStars = (stars) => {
    if (typeof stars === "number") return stars;
    if (typeof stars === "string") return parseInt(stars.replace(/[★\s]/g, "")) || 0;
    return 0;
  };

  // Extract rating history from various formats
  const parseRatingHistory = (contests, ratingData) => {
    const source = contests || ratingData || [];
    return source.slice(-20).map(item => ({
      contestCode: item.code || item.contestCode || item.name,
      contestName: item.name || item.contestName,
      rating: item.rating,
      rank: item.rank,
      date: item.date || item.end_date,
    }));
  };

  return {
    username: data.username || username,
    name: data.name || "",
    stars: parseStars(data.stars),
    rating: data.rating || data.currentRating || 0,
    highestRating: data.highestRating || data.rating || data.currentRating || 0,
    countryName: data.country || data.countryName || "",
    globalRank: data.globalRank || null,
    countryRank: data.countryRank || null,
    totalSolved: data.problemsSolved || data.fullySolved?.count || 0,
    partialSolved: data.partialProblems || data.partiallySolved?.count || 0,
    problemsSolved: {
      easy: 0,
      medium: 0,
      hard: 0,
      challenge: 0,
      peer: 0,
    },
    contestsParticipated: (data.contests || data.ratingData || []).length,
    ratingHistory: parseRatingHistory(data.contests, data.ratingData),
    division: data.division || null,
    badges: data.badges || [],
    avatar: data.avatar || data.profile || null,
  };
}

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

  return normalizeCodeChefData(data, username);
}

/**
 * Yash2003Bisht CodeChef API
 * https://codechef-api.vercel.app/handle/{username}
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

  // Map to consistent structure before normalizing
  const mapped = {
    username: data.username,
    name: data.name,
    stars: data.stars,
    currentRating: data.currentRating || data.rating,
    highestRating: data.highestRating,
    countryName: data.countryName,
    globalRank: data.globalRank,
    countryRank: data.countryRank,
    fullySolved: data.fullySolved,
    partiallySolved: data.partiallySolved,
    ratingData: data.ratingData,
    division: data.division,
    badges: data.badges,
    profile: data.profile,
  };

  return normalizeCodeChefData(mapped, username);
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

  // Map to consistent structure before normalizing
  const mapped = {
    username: data.username,
    name: data.name,
    stars: data.stars,
    currentRating: data.currentRating,
    highestRating: data.highestRating,
    countryName: data.countryName,
    globalRank: data.globalRank,
    countryRank: data.countryRank,
    fullySolved: data.fullySolved,
    partiallySolved: data.partiallySolved,
    ratingData: data.ratingData,
    division: null,
    badges: [],
  };

  return normalizeCodeChefData(mapped, username);
}

export default fetchCodeChef;
