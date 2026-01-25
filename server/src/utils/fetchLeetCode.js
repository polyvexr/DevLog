import axios from "axios";

export const fetchLeetCode = async (username) => {
  try {
    const res = await axios.post("https://leetcode.com/graphql", {
      query: `
        query userProfile($username: String!) {
          matchedUser(username: $username) {
            username
            profile {
              realName
              userAvatar
              birthday
              ranking
              reputation
              websites
              countryName
              company
              school
              skillTags
              aboutMe
              starRating
              solutionCount
              postCount
              categoryDiscussCount
            }
            submitStats {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
              totalSubmissionNum {
                difficulty
                count
                submissions
              }
            }
            badges {
              id
              displayName
              icon
              creationDate
            }
            upcomingBadges {
              name
              icon
              progress
            }
            activeBadge {
              id
              displayName
              icon
            }
            tagProblemCounts {
              advanced {
                tagName
                tagSlug
                problemsSolved
              }
              intermediate {
                tagName
                tagSlug
                problemsSolved
              }
              fundamental {
                tagName
                tagSlug
                problemsSolved
              }
            }
            languageProblemCount {
              languageName
              problemsSolved
            }
            contributions {
              points
              questionCount
              testcaseCount
            }
          }
          allQuestionsCount {
            difficulty
            count
          }
          userContestRanking(username: $username) {
            attendedContestsCount
            rating
            globalRanking
            totalParticipants
            topPercentage
            badge {
              name
            }
          }
          userContestRankingHistory(username: $username) {
            attended
            rating
            ranking
            trendDirection
            problemsSolved
            totalProblems
            finishTimeInSeconds
            contest {
              title
              startTime
            }
          }
          recentAcSubmissionList(username: $username, limit: 15) {
            id
            title
            titleSlug
            timestamp
          }
        }
      `,
      variables: { username },
    }, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "Content-Type": "application/json",
        "Referer": "https://leetcode.com/",
        "Origin": "https://leetcode.com",
      },
      timeout: 25000 // 25 second timeout
    });

    const data = res.data.data;
    const matchedUser = data?.matchedUser;

    if (res.data.errors && !matchedUser) {
      console.log("LeetCode GraphQL Errors (No data):", JSON.stringify(res.data.errors));
      return {};
    }

    if (!matchedUser) {
      return {};
    }

    // Process submission stats
    const submitStats = matchedUser.submitStats || {};
    const acSubmissions = submitStats.acSubmissionNum || [];
    const totalSubmissions = submitStats.totalSubmissionNum || [];

    const submissionsByDifficulty = {
      easy: { solved: 0, total: 0, submissions: 0 },
      medium: { solved: 0, total: 0, submissions: 0 },
      hard: { solved: 0, total: 0, submissions: 0 },
      all: { solved: 0, total: 0, submissions: 0 },
    };

    acSubmissions.forEach((item) => {
      const difficulty = item.difficulty.toLowerCase();
      if (submissionsByDifficulty[difficulty]) {
        submissionsByDifficulty[difficulty].solved = item.count;
        submissionsByDifficulty[difficulty].submissions = item.submissions;
      }
    });

    totalSubmissions.forEach((item) => {
      const difficulty = item.difficulty.toLowerCase();
      if (submissionsByDifficulty[difficulty]) {
        submissionsByDifficulty[difficulty].total = item.count;
      }
    });

    // Profile information
    const profile = matchedUser.profile || {};

    return {
      username: matchedUser.username,
      realName: profile.realName,
      avatar: profile.userAvatar,
      ranking: profile.ranking,
      reputation: profile.reputation,
      countryName: profile.countryName,
      company: profile.company,
      school: profile.school,
      aboutMe: profile.aboutMe,
      skillTags: profile.skillTags || [],
      websites: profile.websites || [],
      starRating: profile.starRating,
      solutionCount: profile.solutionCount || 0,
      postCount: profile.postCount || 0,
      categoryDiscussCount: profile.categoryDiscussCount || 0,

      submissionsByDifficulty,
      totalSolved: submissionsByDifficulty.all.solved,
      totalSubmissions: submissionsByDifficulty.all.submissions,

      tagStats: matchedUser.tagProblemCounts || {},
      languageStats: matchedUser.languageProblemCount || [],

      streakData: {
        currentStreak: 0,
        totalActiveDays: 0,
        activeYears: [],
      },

      contestRanking: data.userContestRanking ? {
        ...data.userContestRanking,
        rating: Math.round(data.userContestRanking.rating)
      } : {},
      contestHistory: (data.userContestRankingHistory || []).slice(-10),
      recentSubmissions: (data.recentAcSubmissionList || []).map(sub => ({
        title: sub.title,
        titleSlug: sub.titleSlug,
        timestamp: sub.timestamp
      })),
      badges: matchedUser.badges || [],
      activeBadge: matchedUser.activeBadge,
      contributions: matchedUser.contributions || {}
    };
  } catch (err) {
    console.log("LC Fetch Error:", err.message);
    return {};
  }
};
