const axios = require("axios");

module.exports = async function fetchGithub(username) {
  try {
    if (!username) return { repos: 0 };
    const url = `https://api.github.com/users/${encodeURIComponent(username)}`;
    const res = await axios.get(url, { timeout: 5000 });
    return {
      login: res.data.login,
      public_repos: res.data.public_repos,
      followers: res.data.followers,
    };
  } catch (err) {
    console.error("fetchGithub error", err.message);
    return null;
  }
};
