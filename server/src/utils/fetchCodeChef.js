import axios from "axios";
import * as cheerio from "cheerio";

/**
 * Fetch CodeChef user statistics
 * Uses multiple API endpoints with fallback chain, plus web scraping for problem count
 */
export const fetchCodeChef = async (username) => {
  // Try multiple APIs in order of reliability
  const apis = [
    () => fetchFromCPRatingAPI(username),
    () => fetchFromCodeChefAPIGitHub(username),
    () => fetchFromOriginalAPI(username),
  ];

  let data = null;

  for (const fetchFn of apis) {
    try {
      data = await fetchFn();
      if (data && Object.keys(data).length > 0 && (data.rating || data.username)) {
        console.log("CodeChef data fetched successfully from API");
        break;
      }
    } catch (err) {
      console.log("CodeChef API attempt failed:", err.message);
      continue;
    }
  }

  // If we got some data but problem count is 0, try web scraping to get accurate count
  if (data && data.totalSolved === 0) {
    try {
      console.log("Problem count is 0, attempting web scrape for accurate count...");
      const scrapedData = await scrapeCodeChefProfile(username);
      if (scrapedData) {
        // Merge scraped data with API data (only update if api data is missing/zero)
        data.totalSolved = scrapedData.totalSolved || data.totalSolved;
        data.partialSolved = scrapedData.partialSolved || data.partialSolved;
        // Also get rating history if API didn't provide it
        if ((!data.ratingHistory || data.ratingHistory.length === 0) && scrapedData.ratingHistory?.length > 0) {
          data.ratingHistory = scrapedData.ratingHistory;
          data.contestsParticipated = scrapedData.contestsParticipated;
        }
        console.log(`Scraped problem count: ${data.totalSolved}`);
      }
    } catch (scrapeErr) {
      console.log("Web scraping fallback failed:", scrapeErr.message);
    }
  }

  // If no API worked, try scraping as last resort
  if (!data || Object.keys(data).length === 0) {
    try {
      console.log("All APIs failed, trying web scrape...");
      data = await scrapeCodeChefProfile(username);
      if (data) {
        console.log("CodeChef data fetched via web scraping");
        return data;
      }
    } catch (scrapeErr) {
      console.log("Web scraping also failed:", scrapeErr.message);
    }
  }

  if (!data || Object.keys(data).length === 0) {
    console.log("All CodeChef APIs and scraping failed for:", username);
    return {};
  }

  return data;
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

/**
 * Web scrape CodeChef profile page to get accurate problem count
 * This is used as a fallback when APIs don't return problem count data
 */
async function scrapeCodeChefProfile(username) {
  try {
    const response = await axios.get(
      `https://www.codechef.com/users/${username}`,
      {
        timeout: 20000,
        headers: {
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
        },
      }
    );

    const html = response.data;
    if (!html || html.includes("Page not found")) {
      throw new Error("User not found");
    }

    const $ = cheerio.load(html);

    // Extract total problems solved from "Total Problems Solved: X" text
    let totalSolved = 0;
    const problemsText = $("h3:contains('Total Problems Solved')").text();
    if (problemsText) {
      const match = problemsText.match(/Total Problems Solved:\s*(\d+)/i);
      if (match) {
        totalSolved = parseInt(match[1], 10) || 0;
      }
    }

    // Also try to find it in the section header
    if (totalSolved === 0) {
      $("section.problems-solved h3").each((_, el) => {
        const text = $(el).text();
        const match = text.match(/Solved:\s*(\d+)/i);
        if (match) {
          totalSolved = parseInt(match[1], 10) || 0;
        }
      });
    }

    // Extract rating from rating-number div
    let rating = 0;
    const ratingText = $(".rating-number").first().text().trim();
    if (ratingText) {
      rating = parseInt(ratingText, 10) || 0;
    }

    // Extract highest rating from small tag (usually in format "Highest Rating XXXX")
    let highestRating = rating;
    $("small").each((_, el) => {
      const text = $(el).text();
      if (text.includes("Highest Rating")) {
        const match = text.match(/(\d+)/);
        if (match) {
          highestRating = parseInt(match[1], 10) || rating;
        }
      }
    });

    // Try to extract ranks from inline-list
    let globalRank = null;
    let countryRank = null;
    const rankLinks = $("ul.inline-list").eq(1).find("a");
    if (rankLinks.length >= 2) {
      globalRank = parseInt($(rankLinks[0]).text().trim(), 10) || null;
      countryRank = parseInt($(rankLinks[1]).text().trim(), 10) || null;
    }

    // Extract country from meta or page content
    let countryName = "";
    const countryMeta = $("meta[property='og:description']").attr("content");
    if (countryMeta) {
      const countryMatch = countryMeta.match(/from\s+([^|]+)/i);
      if (countryMatch) {
        countryName = countryMatch[1].trim();
      }
    }

    // Try to get rating data from embedded JavaScript
    let ratingHistory = [];
    let contestsParticipated = 0;
    const scriptContent = $("script:contains('date_versus_rating')").html();
    if (scriptContent) {
      try {
        // Extract the "all" array more carefully
        const allMatch = scriptContent.match(/"all"\s*:\s*\[/);
        if (allMatch) {
          // Find the start of the array and parse incrementally
          const startIdx = scriptContent.indexOf('"all":') + 6;
          let bracketCount = 0;
          let endIdx = startIdx;
          let started = false;

          for (let i = startIdx; i < scriptContent.length; i++) {
            if (scriptContent[i] === '[') {
              bracketCount++;
              started = true;
            } else if (scriptContent[i] === ']') {
              bracketCount--;
              if (started && bracketCount === 0) {
                endIdx = i + 1;
                break;
              }
            }
          }

          if (endIdx > startIdx) {
            const arrayStr = scriptContent.substring(startIdx, endIdx);
            const ratingData = JSON.parse(arrayStr);
            contestsParticipated = ratingData.length;
            ratingHistory = ratingData.slice(-20).map(item => ({
              contestCode: item.code,
              contestName: item.name,
              rating: parseInt(item.rating, 10) || 0,
              rank: parseInt(item.rank, 10) || 0,
              date: item.end_date,
            }));
          }
        }
      } catch (parseErr) {
        console.log("Failed to parse rating history from page:", parseErr.message);
      }
    }

    // Determine stars from rating
    let stars = 1;
    if (rating >= 1800) stars = 2;
    if (rating >= 2000) stars = 3;
    if (rating >= 2200) stars = 4;
    if (rating >= 2500) stars = 5;
    if (rating >= 2800) stars = 6;
    if (rating >= 3000) stars = 7;

    return {
      username,
      name: "",
      stars,
      rating,
      highestRating,
      countryName,
      globalRank,
      countryRank,
      totalSolved,
      partialSolved: 0,
      problemsSolved: {
        easy: 0,
        medium: 0,
        hard: 0,
        challenge: 0,
        peer: 0,
      },
      contestsParticipated,
      ratingHistory,
      division: null,
      badges: [],
      avatar: null,
    };
  } catch (err) {
    console.log("Scraping CodeChef profile failed:", err.message);
    throw err;
  }
}

export default fetchCodeChef;
