import axios from "axios";

export const fetchGithub = async (username) => {
  try {
    // Fetch user info
    const userRes = await axios.get(`https://api.github.com/users/${username}`);
    const user = userRes.data;

    // Fetch repositories with details
    let repoStats = {
      totalStars: 0,
      totalForks: 0,
      totalWatchers: 0,
      languagesUsed: {},
      topRepositories: [],
      recentRepositories: [],
    };

    try {
      const reposRes = await axios.get(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
      );
      const repos = reposRes.data;

      repos.forEach((repo) => {
        repoStats.totalStars += repo.stargazers_count || 0;
        repoStats.totalForks += repo.forks_count || 0;
        repoStats.totalWatchers += repo.watchers_count || 0;

        if (repo.language) {
          repoStats.languagesUsed[repo.language] =
            (repoStats.languagesUsed[repo.language] || 0) + 1;
        }
      });

      // Get top repositories by stars
      repoStats.topRepositories = repos
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

      // Get recent repositories
      repoStats.recentRepositories = repos.slice(0, 10).map((repo) => ({
        name: repo.name,
        description: repo.description,
        updatedAt: repo.updated_at,
        language: repo.language,
        url: repo.html_url,
      }));
    } catch (err) {
      console.log("GitHub Repos Fetch Error:", err.message);
    }

    // Fetch contribution activity (events)
    let activityStats = {
      totalEvents: 0,
      recentActivity: [],
      eventTypes: {},
    };

    try {
      const eventsRes = await axios.get(
        `https://api.github.com/users/${username}/events/public?per_page=100`
      );
      const events = eventsRes.data;

      activityStats.totalEvents = events.length;

      events.forEach((event) => {
        activityStats.eventTypes[event.type] =
          (activityStats.eventTypes[event.type] || 0) + 1;
      });

      activityStats.recentActivity = events.slice(0, 10).map((event) => ({
        type: event.type,
        repo: event.repo.name,
        createdAt: event.created_at,
      }));
    } catch (err) {
      console.log("GitHub Events Fetch Error:", err.message);
    }

    // Fetch user organizations
    let organizations = [];
    try {
      const orgsRes = await axios.get(
        `https://api.github.com/users/${username}/orgs`
      );
      organizations = orgsRes.data.map((org) => ({
        name: org.login,
        avatar: org.avatar_url,
        description: org.description,
      }));
    } catch (err) {
      console.log("GitHub Orgs Fetch Error:", err.message);
    }

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

      // Repository statistics
      ...repoStats,

      // Activity statistics
      ...activityStats,

      // Organizations
      organizations,
    };
  } catch (err) {
    console.log("GitHub Fetch Error:", err.message);
    return {};
  }
};
