import * as links from "./src/utils/links.js";

// Colors for terminal formatting
const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const BOLD = "\x1b[1m";

// Test parameters
const testUsername = "tourist";
const testGithubUsername = "12345";
const testToken = "dfghjk";
const testContestId = "1800";
const testContestSlug = "weekly-contest-290";
const testContestCode = "START50";

const urlsToTest = [
  // 1. Telegram
  { name: "TELEGRAM_SEND_MESSAGE", url: links.TELEGRAM_SEND_MESSAGE(testToken) },

  // 2. Codeforces
  { name: "CODEFORCES_CONTEST_LIST", url: links.CODEFORCES_CONTEST_LIST },
  { name: "CODEFORCES_CONTEST_URL", url: links.CODEFORCES_CONTEST_URL(testContestId) },
  { name: "CODEFORCES_USER_INFO", url: links.CODEFORCES_USER_INFO(testUsername) },
  { name: "CODEFORCES_USER_STATUS", url: links.CODEFORCES_USER_STATUS(testUsername) },
  { name: "CODEFORCES_USER_RATING", url: links.CODEFORCES_USER_RATING(testUsername) },

  // 3. LeetCode
  { name: "LEETCODE_REFERER", url: links.LEETCODE_REFERER },
  { name: "LEETCODE_ORIGIN", url: links.LEETCODE_ORIGIN },
  { name: "LEETCODE_GRAPHQL", url: links.LEETCODE_GRAPHQL },
  { name: "LEETCODE_CONTEST_URL", url: links.LEETCODE_CONTEST_URL(testContestSlug) },

  // 4. CodeChef
  { name: "CODECHEF_CONTEST_LIST", url: links.CODECHEF_CONTEST_LIST },
  { name: "CODECHEF_CONTEST_URL", url: links.CODECHEF_CONTEST_URL(testContestCode) },
  ...links.CODECHEF_API_FALLBACKS(testUsername).map((url, i) => ({
    name: `CODECHEF_API_FALLBACKS [${i}]`,
    url
  })),
  { name: "CODECHEF_USER_URL", url: links.CODECHEF_USER_URL(testUsername) },

  // 5. Clist
  { name: "CLIST_CONTESTS", url: links.CLIST_CONTESTS },

  // 6. AtCoder
  { name: "ATCODER_CONTESTS", url: links.ATCODER_CONTESTS },
  { name: "ATCODER_BASE", url: links.ATCODER_BASE },
  { name: "ATCODER_USER_HISTORY", url: links.ATCODER_USER_HISTORY(testUsername) },
  { name: "ATCODER_USER_AC_RANK", url: links.ATCODER_USER_AC_RANK(testUsername) },
  { name: "ATCODER_USER_SUBMISSIONS", url: links.ATCODER_USER_SUBMISSIONS(testUsername) },
  { name: "ATCODER_PROBLEM_MODELS", url: links.ATCODER_PROBLEM_MODELS },

  // 7. GitHub
  { name: "GITHUB_USER_INFO", url: links.GITHUB_USER_INFO(testGithubUsername) },
  { name: "GITHUB_USER_REPOS", url: links.GITHUB_USER_REPOS(testGithubUsername) },
  { name: "GITHUB_USER_EVENTS", url: links.GITHUB_USER_EVENTS(testGithubUsername) },
  { name: "GITHUB_USER_ORGS", url: links.GITHUB_USER_ORGS(testGithubUsername) },
];

const testUrl = async ({ name, url }) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6-second timeout

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "*/*",
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Categorize response:
    // - 2xx/3xx are completely working (OK).
    // - 401/403/404 are reachable (server responded, but requires auth or specific parameters).
    // - 5xx are server errors.
    const status = response.status;
    let category = "failed";
    let color = RED;

    if (status >= 200 && status < 400) {
      category = "working";
      color = GREEN;
    } else if (status >= 400 && status < 500) {
      category = "reachable (auth/param check required)";
      color = YELLOW;
    }

    return { name, url, status, category, color, success: true };
  } catch (error) {
    clearTimeout(timeoutId);
    const errorMsg = error.name === "AbortError" ? "Timeout (6s)" : error.message;
    return { name, url, status: "ERROR", category: errorMsg, color: RED, success: false };
  }
};

const runTests = async () => {
  console.log(`${BOLD}${CYAN}=== Starting DevLog URL Tests ===${RESET}\n`);

  let workingCount = 0;
  let reachableCount = 0;
  let failedCount = 0;

  for (let i = 0; i < urlsToTest.length; i++) {
    const item = urlsToTest[i];
    process.stdout.write(`[${i + 1}/${urlsToTest.length}] Testing ${item.name}... `);

    const result = await testUrl(item);

    if (result.category === "working") workingCount++;
    else if (result.status !== "ERROR" && result.status >= 400 && result.status < 500) reachableCount++;
    else failedCount++;

    const statusLabel = result.success ? `HTTP ${result.status}` : "FAILED";
    console.log(`${result.color}[${result.category.toUpperCase()}] (${statusLabel})${RESET}`);
    console.log(`    URL: ${result.url}`);
  }

  console.log(`\n${BOLD}${CYAN}=== Test Summary ===${RESET}`);
  console.log(`${GREEN}Working (2xx/3xx):  ${workingCount}${RESET}`);
  console.log(`${YELLOW}Reachable (4xx):     ${reachableCount}${RESET}`);
  console.log(`${RED}Failed/Errors:       ${failedCount}${RESET}`);
  console.log(`${BOLD}${CYAN}====================${RESET}\n`);
};

runTests();
