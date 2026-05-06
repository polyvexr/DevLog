import axios from "axios";
import logger from "./logger.js";

// Get GitHub headers (with optional authentication)
const getGitHubHeaders = () => {
  const headers = {
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "DevLog-App"
  };

  // Use token if available (increases rate limit from 60/hr to 5000/hr)
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
};

export const fetchGithub = async (username) => {
  try {
    const headers = getGitHubHeaders();

    // Fetch basic user info first to verify user exists
    const userRes = await axios.get(
      `https://api.github.com/users/${username}`,
      { timeout: 15000, headers }
    );
    const user = userRes.data;

    // Parallel fetch secondary data
    const [reposRes, eventsRes, orgsRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { timeout: 20000, headers }).catch(() => ({ data: [] })),
      axios.get(`https://api.github.com/users/${username}/events/public?per_page=100`, { timeout: 15000, headers }).catch(() => ({ data: [] })),
      axios.get(`https://api.github.com/users/${username}/orgs`, { timeout: 10000, headers }).catch(() => ({ data: [] })),
    ]);

    // Process repositories
    const repos = reposRes.data;
    const repoStats = {
      totalStars: 0,
      totalForks: 0,
      totalWatchers: 0,
      languagesUsed: {},
      topRepositories: [],
      recentRepositories: [],
    };

    repos.forEach((repo) => {
      repoStats.totalStars += repo.stargazers_count || 0;
      repoStats.totalForks += repo.forks_count || 0;
      repoStats.totalWatchers += repo.watchers_count || 0;

      if (repo.language) {
        repoStats.languagesUsed[repo.language] = (repoStats.languagesUsed[repo.language] || 0) + 1;
      }
    });

    repoStats.topRepositories = [...repos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 10)
      .map((repo) => ({
        name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        url: repo.html_url,
      }));

    repoStats.recentRepositories = repos.slice(0, 10).map((repo) => ({
      name: repo.name,
      description: repo.description,
      updatedAt: repo.updated_at,
      language: repo.language,
      url: repo.html_url,
    }));

    // Process activity
    const events = eventsRes.data;
    const activityStats = {
      totalEvents: events.length,
      recentActivity: events.slice(0, 10).map((event) => ({
        type: event.type,
        repo: event.repo.name,
        createdAt: event.created_at,
      })),
      eventTypes: {},
    };

    events.forEach((event) => {
      activityStats.eventTypes[event.type] = (activityStats.eventTypes[event.type] || 0) + 1;
    });

    // Process organizations
    const organizations = orgsRes.data.map((org) => ({
      name: org.login,
      avatar: org.avatar_url,
      description: org.description,
    }));

    return {
      // Basic user info
      name: user.name,
      bio: user.bio,
      company: user.company,
      location: user.location,
      email: user.email,
      blog: user.blog,
      twitterUsername: user.twitter_username,
      hireable: user.hireable,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      publicGists: user.public_gists,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      avatar: user.avatar_url,
      profileUrl: user.html_url,

      ...repoStats,
      ...activityStats,
      organizations,
    };
  } catch (err) {
    logger.error(`GitHub Fetch Error [${username}]:`, { error: err.message });
    return { error: err.response?.status === 404 ? "User not found" : err.message };
  }
};

