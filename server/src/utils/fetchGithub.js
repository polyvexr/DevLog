import axios from "axios";

export const fetchGithub = async (username) => {
  try {
    const res = await axios.get(`https://api.github.com/users/${username}`);

    return {
      followers: res.data.followers,
      following: res.data.following,
      publicRepos: res.data.public_repos,
      publicGists: res.data.public_gists,
      createdAt: res.data.created_at,
    };
  } catch (err) {
    console.log("GitHub Fetch Error:", err.message);
    return {};
  }
};
