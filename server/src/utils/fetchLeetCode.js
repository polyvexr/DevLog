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
            submitStatsGlobal {
              acSubmissionNum {
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
            userCalendar {
              activeYears
              streak
              totalActiveDays
              dccBadges {
                timestamp
                badge {
                  name
                  icon
                }
              }
              submissionCalendar
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
    });

    const data = res.data.data;
    const matchedUser = data.matchedUser;

    if (!matchedUser) {
      return {};
    }

    // Process submission stats
    const submitStats = matchedUser.submitStats || {};
    const acSubmissions = submitStats.acSubmissionNum || [];
    const totalSubmissions = submitStats.totalSubmissionNum || [];

    const submissionsByDifficulty = {
      easy: {
        solved: 0,
        total: 0,
        submissions: 0,
      },
      medium: {
        solved: 0,
        total: 0,
        submissions: 0,
      },
      hard: {
        solved: 0,
        total: 0,
        submissions: 0,
      },
      all: {
        solved: 0,
        total: 0,
        submissions: 0,
      },
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
        submissionsByDifficulty[difficulty].total = item.submissions;
      }
    });

    // Process tag problem counts
    const tagStats = {
      advanced: [],
      intermediate: [],
      fundamental: [],
    };

    if (matchedUser.tagProblemCounts) {
      tagStats.advanced = matchedUser.tagProblemCounts.advanced || [];
      tagStats.intermediate = matchedUser.tagProblemCounts.intermediate || [];
      tagStats.fundamental = matchedUser.tagProblemCounts.fundamental || [];
    }

    // Process language stats
    const languageStats = matchedUser.languageProblemCount || [];

    // Process calendar and streak data
    const calendar = matchedUser.userCalendar || {};
    const streakData = {
      currentStreak: calendar.streak || 0,
      totalActiveDays: calendar.totalActiveDays || 0,
      activeYears: calendar.activeYears || [],
      dccBadges: calendar.dccBadges || [],
    };

    // Process contest ranking
    const contestRanking = data.userContestRanking || {};
    const contestHistory = data.userContestRankingHistory || [];

    // Process recent submissions
    const recentSubmissions = data.recentAcSubmissionList || [];

    // Process badges
    const badges = matchedUser.badges || [];
    const upcomingBadges = matchedUser.upcomingBadges || [];
    const activeBadge = matchedUser.activeBadge || null;

    // Profile information
    const profile = matchedUser.profile || {};

    return {
      // Basic profile
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

      // Submission statistics
      submissionsByDifficulty,
      totalSolved:
        submissionsByDifficulty.easy.solved +
        submissionsByDifficulty.medium.solved +
        submissionsByDifficulty.hard.solved,
      totalSubmissions:
        submissionsByDifficulty.easy.total +
        submissionsByDifficulty.medium.total +
        submissionsByDifficulty.hard.total,
      acceptanceRate:
        submissionsByDifficulty.all.total > 0
          ? (
              (submissionsByDifficulty.all.solved /
                submissionsByDifficulty.all.total) *
              100
            ).toFixed(2)
          : 0,

      // Tag-based statistics
      tagStats,

      // Language statistics
      languageStats,

      // Streak and calendar
      streakData,

      // Contest information
      contestRanking: {
        attendedContestsCount: contestRanking.attendedContestsCount || 0,
        rating: contestRanking.rating ? Math.round(contestRanking.rating) : 0,
        globalRanking: contestRanking.globalRanking || 0,
        totalParticipants: contestRanking.totalParticipants || 0,
        topPercentage: contestRanking.topPercentage
          ? contestRanking.topPercentage.toFixed(2)
          : 0,
        badge: contestRanking.badge?.name || null,
      },
      contestHistory: contestHistory.slice(0, 10).map((contest) => ({
        attended: contest.attended,
        rating: Math.round(contest.rating),
        ranking: contest.ranking,
        problemsSolved: contest.problemsSolved,
        totalProblems: contest.totalProblems,
        contestTitle: contest.contest?.title,
        contestDate: contest.contest?.startTime,
      })),

      // Recent activity
      recentSubmissions: recentSubmissions.map((sub) => ({
        title: sub.title,
        titleSlug: sub.titleSlug,
        timestamp: sub.timestamp,
      })),

      // Badges
      badges: badges.map((badge) => ({
        id: badge.id,
        displayName: badge.displayName,
        icon: badge.icon,
        creationDate: badge.creationDate,
      })),
      upcomingBadges,
      activeBadge,

      // Contributions
      contributions: matchedUser.contributions || {
        points: 0,
        questionCount: 0,
        testcaseCount: 0,
      },
    };
  } catch (err) {
    console.log("LC Fetch Error:", err.message);
    return {};
  }
};
