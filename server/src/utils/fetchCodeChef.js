import axios from "axios";
import * as cheerio from "cheerio";
import logger from "./logger.js";

import { CODECHEF_API_FALLBACKS, CODECHEF_USER_URL } from "./links.js";

const pInt = (v) => parseInt(v?.toString().replace(/[^\d]/g, "")) || 0;

const norm = (d, h) => {
  const r = pInt(d.rating || d.currentRating);
  const hist = (d.contests || d.ratingData || []).slice(-20).map(i => ({
    contestCode: i.code || i.contestCode || i.name,
    contestName: i.name || i.contestName,
    rating: i.rating,
    rank: i.rank,
    date: i.date || i.end_date,
  }));
  return {
    username: d.username || h,
    name: d.name || "",
    stars: pInt(d.stars),
    rating: r,
    highestRating: Math.max(r, pInt(d.highestRating)),
    countryName: d.country || d.countryName || "",
    globalRank: d.globalRank || null,
    countryRank: d.countryRank || null,
    totalSolved: d.problemsSolved || d.fullySolved?.count || 0,
    partialSolved: d.partialProblems || d.partiallySolved?.count || 0,
    contestsParticipated: (d.contests || d.ratingData || []).length,
    ratingHistory: hist,
    division: d.division || null,
    avatar: d.avatar || d.profile || null,
  };
};

export const fetchCodeChef = async (username) => {
  const endpoints = CODECHEF_API_FALLBACKS(username);

  // Try API endpoints sequentially, prioritizing working ones first
  for (const url of endpoints) {
    try {
      const res = await axios.get(url, { timeout: 5000 });
      if (res.data && (res.data.rating || res.data.currentRating)) {
        const data = norm(res.data, username);
        if (data && data.totalSolved > 0) {
          return data;
        }
      }
    } catch (err) {
      logger.warn(`CodeChef API endpoint failed: ${url}`, { error: err.message });
    }
  }

  // Fallback to scraping
  try {
    const scraped = await scrape(username);
    return scraped || {};
  } catch (err) {
    logger.error(`CodeChef Fetch Error [${username}]:`, { error: err.message });
    return {};
  }
};

async function scrape(username) {
  const res = await axios.get(CODECHEF_USER_URL(username), {
    timeout: 15000,
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  const $ = cheerio.load(res.data);
  const rText = $(".rating-number").first().text().trim();
  const rating = pInt(rText);

  let solved = 0;
  const pMatch = $("h3:contains('Total Problems Solved')").text().match(/(\d+)/);
  if (pMatch) solved = pInt(pMatch[1]);

  let hist = [];
  const script = $("script:contains('date_versus_rating')").html();
  if (script) {
    const match = script.match(/"all"\s*:\s*(\[.*?\]),/);
    if (match) {
      try {
        const d = JSON.parse(match[1]);
        hist = d.slice(-20).map(i => ({
          contestCode: i.code,
          rating: pInt(i.rating),
          rank: pInt(i.rank),
          date: i.end_date
        }));
      } catch { }
    }
  }

  return {
    username,
    rating,
    totalSolved: solved,
    ratingHistory: hist,
    highestRating: rating,
    contestsParticipated: hist.length,
    stars: rating < 1400 ? 1 : rating < 1600 ? 2 : rating < 1800 ? 3 : rating < 2000 ? 4 : rating < 2200 ? 5 : rating < 2500 ? 6 : 7
  };
}

export default fetchCodeChef;

