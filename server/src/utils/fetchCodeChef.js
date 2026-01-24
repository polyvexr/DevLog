import axios from "axios";
import * as cheerio from "cheerio";

const pInt = (v) => parseInt(v?.toString().replace(/[^\d]/g, "")) || 0;

const norm = (d, h) => {
  const r = pInt(d.rating || d.currentRating);
  const hist = (d.contests || d.ratingData || []).slice(-20).map(i => ({
    contestCode: i.code || i.contestCode || i.name, contestName: i.name || i.contestName,
    rating: i.rating, rank: i.rank, date: i.date || i.end_date,
  }));
  return {
    username: d.username || h, name: d.name || "", stars: pInt(d.stars),
    rating: r, highestRating: Math.max(r, pInt(d.highestRating)),
    countryName: d.country || d.countryName || "", globalRank: d.globalRank || null,
    countryRank: d.countryRank || null, totalSolved: d.problemsSolved || d.fullySolved?.count || 0,
    partialSolved: d.partialProblems || d.partiallySolved?.count || 0,
    contestsParticipated: (d.contests || d.ratingData || []).length, ratingHistory: hist,
    division: d.division || null, avatar: d.avatar || d.profile || null,
  };
};

export const fetchCodeChef = async (username) => {
  const endpoints = [
    `https://cp-rating-api.vercel.app/codechef/${username}`,
    `https://codechef-api.vercel.app/handle/${username}`,
    `https://codechef-api.onrender.com/handle/${username}`
  ];

  let data = null;
  for (const url of endpoints) {
    try {
      const res = await axios.get(url, { timeout: 15000 });
      if (res.data && (res.data.rating || res.data.currentRating)) {
        data = norm(res.data, username);
        break;
      }
    } catch { continue; }
  }

  if (!data || data.totalSolved === 0) {
    try {
      const scraped = await scrape(username);
      if (scraped) data = data ? { ...data, ...scraped } : scraped;
    } catch { }
  }

  return data || {};
};

async function scrape(username) {
  const res = await axios.get(`https://www.codechef.com/users/${username}`, {
    timeout: 20000,
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
        hist = d.slice(-20).map(i => ({ contestCode: i.code, rating: pInt(i.rating), rank: pInt(i.rank), date: i.end_date }));
      } catch { }
    }
  }

  return {
    username, rating, totalSolved: solved, ratingHistory: hist,
    highestRating: rating, contestsParticipated: hist.length,
    stars: rating < 1400 ? 1 : rating < 1600 ? 2 : rating < 1800 ? 3 : rating < 2000 ? 4 : rating < 2200 ? 5 : rating < 2500 ? 6 : 7
  };
}

export default fetchCodeChef;
