import axios from "axios";

export const fetchCodeforces = async (username) => {
  try {
    const res = await axios.get(
      `https://codeforces.com/api/user.info?handles=${username}`
    );

    if (res.data.status !== "OK") return {};

    const user = res.data.result[0];

    return {
      rating: user.rating || 0,
      maxRating: user.maxRating || 0,
      rank: user.rank || "unrated",
      maxRank: user.maxRank || "unrated",
      friendOfCount: user.friendOfCount || 0,
    };
  } catch (err) {
    console.log("CF Fetch Error:", err.message);
    return {};
  }
};
