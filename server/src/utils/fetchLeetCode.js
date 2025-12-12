const axios = require("axios");

module.exports = async function fetchLeetCode(username) {
  // Placeholder: LeetCode has no official public simple API; real implementation
  // would scrape or use a third-party API. Here we return a mock object.
  try {
    if (!username) return { solved: 0 };
    return { username, solved: 0, easy: 0, medium: 0, hard: 0 };
  } catch (err) {
    console.error("fetchLeetCode error", err.message);
    return null;
  }
};
