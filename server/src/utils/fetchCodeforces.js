const axios = require("axios");

module.exports = async function fetchCodeforces(handle) {
  try {
    if (!handle) return { rating: null };
    const url = `https://codeforces.com/api/user.info?handles=${encodeURIComponent(
      handle
    )}`;
    const res = await axios.get(url, { timeout: 5000 });
    if (res.data && res.data.status === "OK") {
      return res.data.result[0];
    }
    return null;
  } catch (err) {
    console.error("fetchCodeforces error", err.message);
    return null;
  }
};
