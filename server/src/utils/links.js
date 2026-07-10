// Telegram
export const TELEGRAM_SEND_MESSAGE = (token) => `https://api.telegram.org/bot${token}/sendMessage`;

// Codeforces
export const CODEFORCES_CONTEST_LIST = "https://codeforces.com/api/contest.list";
export const CODEFORCES_CONTEST_URL = (id) => `https://codeforces.com/contest/${id}`;
export const CODEFORCES_USER_INFO = (username) => `https://codeforces.com/api/user.info?handles=${username}`;
export const CODEFORCES_USER_STATUS = (username) => `https://codeforces.com/api/user.status?handle=${username}&from=1&count=5000`;
export const CODEFORCES_USER_RATING = (username) => `https://codeforces.com/api/user.rating?handle=${username}`;

// LeetCode
export const LEETCODE_REFERER = "https://leetcode.com/";
export const LEETCODE_ORIGIN = "https://leetcode.com";
export const LEETCODE_GRAPHQL = "https://leetcode.com/graphql";
export const LEETCODE_CONTEST_URL = (slug) => `https://leetcode.com/contest/${slug}`;

// CodeChef
export const CODECHEF_CONTEST_LIST = "https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all";
export const CODECHEF_CONTEST_URL = (code) => `https://www.codechef.com/${code}`;
export const CODECHEF_API_FALLBACKS = (username) => [
  `https://cp-rating-api.vercel.app/codechef/${username}`,
  `https://codechef-api.vercel.app/handle/${username}`,
  `https://codechef-api.onrender.com/handle/${username}`
];
export const CODECHEF_USER_URL = (username) => `https://www.codechef.com/users/${username}`;

// Clist
export const CLIST_CONTESTS = "https://clist.by/api/v4/contest/";

// AtCoder
export const ATCODER_CONTESTS = "https://atcoder.jp/contests/";
export const ATCODER_BASE = "https://atcoder.jp";
export const ATCODER_USER_HISTORY = (username) => `https://atcoder.jp/users/${username}/history/json`;
export const ATCODER_USER_AC_RANK = (username) => `https://kenkoooo.com/atcoder/atcoder-api/v3/user/ac_rank?user=${username}`;
export const ATCODER_USER_SUBMISSIONS = (username) => `https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${username}&from_second=0`;
export const ATCODER_PROBLEM_MODELS = "https://kenkoooo.com/atcoder/resources/problem-models.json";

// GitHub
export const GITHUB_USER_INFO = (username) => `https://api.github.com/users/${username}`;
export const GITHUB_USER_REPOS = (username) => `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;
export const GITHUB_USER_EVENTS = (username) => `https://api.github.com/users/${username}/events/public?per_page=100`;
export const GITHUB_USER_ORGS = (username) => `https://api.github.com/users/${username}/orgs`;
