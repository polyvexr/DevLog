# DevLog - Complete Project Documentation

> A comprehensive developer activity tracking dashboard that aggregates statistics from LeetCode, Codeforces, and GitHub.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Backend Documentation](#backend-documentation)
  - [Server Entry Point](#server-entry-point)
  - [Database Configuration](#database-configuration)
  - [Models](#models)
  - [Controllers](#controllers)
  - [Middleware](#middleware)
  - [External API Utilities](#external-api-utilities)
- [Frontend Documentation](#frontend-documentation)
  - [Application Entry](#application-entry)
  - [Routing Configuration](#routing-configuration)
  - [Context Providers](#context-providers)
  - [API Client](#api-client)
  - [Components](#components)
  - [Pages](#pages)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Authentication & Authorization](#authentication--authorization)
- [Features Deep Dive](#features-deep-dive)
- [Styling & Design System](#styling--design-system)
- [Environment Configuration](#environment-configuration)
- [Deployment Guide](#deployment-guide)
- [Security Considerations](#security-considerations)
- [Scripts](#scripts)
- [Contributing](#contributing)

---

## Project Overview

**DevLog** is a comprehensive developer activity tracking dashboard that aggregates statistics from multiple major coding platforms:

| Platform | Description |
|----------|-------------|
| **LeetCode** | Competitive programming and interview preparation |
| **Codeforces** | Competitive programming contests |
| **GitHub** | Open source contributions and repositories |
| **AtCoder** | Japanese competitive programming platform |
| **CodeChef** | Indian competitive programming platform |

### Core Value Proposition

- **Unified Dashboard**: Single interface to view all coding activities.
- **Progress Tracking**: Monitor growth across platforms over time.
- **Contest Calendar**: Stay updated with upcoming contests from CList API.
- **Public Profiles**: Showcase your stats to others via a dedicated URL.
- **Admin Control**: Manual and automated synchronization to manage API rate limits.
- **Real-time Stats**: Detailed statistics including problems solved, ratings, and contributions.
- **Telegram Notifications**: Get notified about your progress and contest schedules.

---

## Architecture

### High-Level Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Client   │────▶│  Express API    │────▶│    MongoDB      │
│  (Vite + React) │     │  (Node.js)      │     │   (Database)    │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   External APIs        │
                    │  - LeetCode GraphQL    │
                    │  - Codeforces API      │
                    │  - GitHub REST API     │
                    └────────────────────────┘
```

### Data Flow

1. **User Authentication** → JWT token issued
2. **Platform Linking** → Username stored, initial data fetch
3. **Stats Display** → Cached data from MongoDB
4. **Manual Refresh** → Admin/User triggered sync with cooldown
5. **Admin Sync** → Bulk synchronization for all users

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI Framework |
| Vite | 7.x | Build Tool & Dev Server |
| React Router | 7.x | Client-side Routing |
| Axios | 1.x | HTTP Client |
| Tailwind CSS | 4.x | Utility-first CSS |
| React Icons | 5.x | Icon Library |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x+ | Runtime Environment |
| Express | 5.x | Web Framework |
| MongoDB | 7.x+ | Database |
| Mongoose | 9.x | ODM |
| JWT | - | Authentication |
| Bcrypt | 3.x | Password Hashing |

### External APIs

| Platform | API Type | Endpoint |
|----------|----------|----------|
| LeetCode | GraphQL | `https://leetcode.com/graphql` |
| Codeforces | REST | `https://codeforces.com/api/` |
| GitHub | REST | `https://api.github.com/` |
| AtCoder | Scraping | `https://atcoder.jp/users/` |
| CodeChef | REST/Scraping | `https://www.codechef.com/users/` |

---

## Project Structure

### Complete Directory Tree

```
DevLog/
├── .gitignore
├── README.md
├── DOCUMENTATION.md
│
├── client/                          # Frontend Application
│   ├── .env.example                 # Environment template
│   ├── eslint.config.js             # ESLint configuration
│   ├── index.html                   # HTML entry point
│   ├── package.json                 # Dependencies
│   ├── vite.config.js               # Vite configuration
│   │
│   └── src/
│       ├── App.jsx                  # Root component & routing
│       ├── main.jsx                 # Application entry
│       ├── index.css                # Global styles & animations
│       │
│       ├── api/
│       │   └── axios.js             # API client configuration
│       │
│       ├── components/
│       │   ├── AuthenticatedLayout.jsx  # Protected route layout
│       │   ├── ContestCard.jsx          # Contest display component
│       │   ├── FullPageLoader.jsx       # Global loading state
│       │   ├── PlatformCard.jsx         # Platform stats card
│       │   ├── PlatformDetails.jsx      # Detailed platform stats
│       │   └── Sidebar.jsx              # Navigation sidebar
│       │
│       ├── context/
│       │   ├── AuthProvider.jsx         # Auth state provider
│       │   └── SidebarProvider.jsx      # Sidebar state provider
│       │
│       ├── hooks/
│       │   ├── useApi.js                # Global API handling hook
│       │   └── useSidebar.js            # Sidebar custom hook
│       │
│       └── pages/
│           ├── AdminDashboard.jsx       # Admin control panel
│           ├── AdminUsers.jsx           # User management for admins
│           ├── Dashboard.jsx            # Main dashboard
│           ├── Contests.jsx             # Contest calendar page
│           ├── PublicProfile.jsx        # Public stats page
│           ├── Settings.jsx             # User settings & profile
│           ├── LeetCodeDetails.jsx      # Platform specific pages...
│           └── ...
│
└── server/                          # Backend Application
    ├── .env                         # Environment variables
    ├── .env.example                 # Environment template
    ├── server.js                    # Application entry
    ├── api/
    │   └── index.js                 # Vercel serverless entry
    │
    ├── src/
    │   ├── config/
    │   │   ├── db.js                # MongoDB connection
    │   │   └── logger.js            # Winston logger setup
    │   │
    │   ├── controllers/
    │   │   ├── adminController.js   # Admin operations
    │   │   ├── contestController.js # Contest data management
    │   │   ├── cronController.js    # Sync orchestrator
    │   │   ├── statsController.js   # User statistics
    │   │   └── ...
    │   │
    │   ├── cron/
    │   │   ├── index.js             # Cron entry point
    │   │   ├── fetchContests.js     # Background contest fetcher
    │   │   └── processSyncJobs.js   # User data sync worker
    │   │
    │   ├── middleware/
    │   │   ├── auth.js              # JWT verification
    │   │   └── adminAuth.js         # Admin authorization
    │   │
    │   ├── models/
    │   │   ├── User.js              # User & Role schema
    │   │   ├── PlatformStat.js      # Cached platform data
    │   │   ├── Contest.js           # Contest calendar data
    │   │   └── SyncJob.js           # Tracking sync status
    │   │
    │   ├── routes/                  # Express routing...
    │   │
    │   ├── services/
    │   │   ├── emailService.js      # Resend integration
    │   │   ├── telegramService.js   # Telegram bot integration
    │   │   └── platformService.js   # Core sync logic
    │   │
    │   └── utils/
    │       ├── fetchLeetCode.js     # Platform fetchers...
    │       └── cache.js             # Utility for caching
    │
    └── scripts/                     # Utility & Migration scripts
```

---

## Backend Documentation

### Server Entry Point

**File**: `server/server.js`

```javascript
// Core setup
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";

// Configuration
const PORT = process.env.PORT || 5000;
const app = express();

// Middleware stack
app.use("/api", apiLimiter);      // Rate limiting
app.use(express.json());           // JSON parsing
app.use(cors(corsOptions));        // CORS handling

// Route mounting
app.use("/api/auth", authRoutes);
app.use("/api/auth", passwordRoutes);
app.use("/api/platforms", platformRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
```

---

### Database Configuration

**File**: `server/src/config/db.js`

MongoDB connection using Mongoose with connection pooling and retry logic.

---

### Models

#### User Model

**File**: `server/src/models/User.js`

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  oneTimeReaddUsed: { type: Map, of: Boolean, default: {} },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: { type: Date, default: Date.now },
});
```

**Methods**:

| Method | Description |
|--------|-------------|
| `matchPassword` | Compare password with hash |
| `generateResetToken` | Generate password reset token |

**Features**:
- Pre-save password hashing with bcrypt
- Password comparison method
- Reset token generation with crypto

---

#### PlatformStat Model

**File**: `server/src/models/PlatformStat.js`

```javascript
const platformStatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  platform: { type: String, enum: ["leetcode", "codeforces", "github"] },
  username: String,
  data: { type: Object, default: {} },
  stats: { type: Object, default: {} },
  lastUpdated: Date,
  lastManualRefresh: { type: Date, default: null },
});
```

---

#### PlatformAction Model

**File**: `server/src/models/PlatformAction.js`

```javascript
const platformActionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  platform: { type: String, enum: ["leetcode", "codeforces", "github", "atcoder", "codechef"] },
  action: { type: String, enum: ["link", "unlink"] },
  meta: { type: Object, default: {} },
}, { timestamps: true });
```

---

#### Contest Model

**File**: `server/src/models/Contest.js`

```javascript
const contestSchema = new mongoose.Schema({
  platform: String,
  title: String,
  url: String,
  startTime: Date,
  duration: Number,
  clistId: { type: Number, unique: true },
}, { timestamps: true });
```

---

#### SyncJob Model

**File**: `server/src/models/SyncJob.js`

```javascript
const syncJobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["full", "platform"] },
  platform: String,
  status: { type: String, enum: ["pending", "processing", "completed", "failed"] },
  startedAt: Date,
  completedAt: Date,
  error: String,
}, { timestamps: true });
```

---

### Controllers

#### Authentication Controller

**File**: `server/src/controllers/authController.js`

| Function | Description |
|----------|-------------|
| `register` | Create new user account |
| `login` | Authenticate user, return JWT |
| `getMe` | Get current user profile |
| `updateProfile` | Update user information |
| `updatePassword` | Change password |
| `updateSettings` | Update user preferences |

---

#### Admin Controller

**File**: `server/src/controllers/adminController.js`

| Function | Description |
|----------|-------------|
| `syncAllPlatforms` | Sync all platforms for all users |
| `syncLeetCode` | Sync only LeetCode data |
| `syncCodeforces` | Sync only Codeforces data |
| `syncGitHub` | Sync only GitHub data |
| `getSyncStats` | Get admin dashboard statistics |
| `getAllUsers` | List and manage all registered users |

---

#### Contest Controller

**File**: `server/src/controllers/contestController.js`

| Function | Description |
|----------|-------------|
| `getUpcomingContests` | Retrieve upcoming contests from DB |
| `refreshContests` | Trigger background fetch from CList |

---

#### Cron Controller

**File**: `server/src/controllers/cronController.js`

| Function | Description |
|----------|-------------|
| `handleUnifiedCron` | Orchestrates daily sync and contest fetching |
| `triggerSyncQueue` | Manually starts the background sync worker |

---

#### Public Profile Controller

**File**: `server/src/controllers/publicProfileController.js`

| Function | Description |
|----------|-------------|
| `getPublicProfile` | Fetches public stats for a specific username |
| `getPublicStats` | Returns specific platform stats for public view |

---

#### Dashboard Controller

**File**: `server/src/controllers/dashboardController.js`

| Function | Description |
|----------|-------------|
| `getUserDashboard` | Aggregates all user stats for the home page |

---

#### Stats Controller

**File**: `server/src/controllers/statsController.js`

| Function | Description |
|----------|-------------|
| `getAllStats` | Get all platform stats for user |
| `getStatsSummary` | Get aggregated summary |
| `refreshPlatformStats` | Manual refresh with cooldown |

**Progress Calculation**:

```javascript
const calculateProgress = (platform, stats) => {
  switch (platform) {
    case "leetcode":
      // Progress = (solved / total) * 100
      return Math.min(Math.round((totalSolved / 3250) * 100), 100);
    case "codeforces":
      // Progress = (rating / 3000) * 100 (grandmaster target)
      return Math.min(Math.round((rating / 3000) * 100), 100);
    case "github":
      // Based on repositories, stars, commits
      // Custom algorithm
  }
};
```

---

#### Platform Controller

**File**: `server/src/controllers/platformController.js`

| Function | Description |
|----------|-------------|
| `linkPlatform` | Link external platform account |
| `getPlatforms` | Get linked platforms |
| `unlinkPlatform` | Remove platform connection |

---

#### User Controller

**File**: `server/src/controllers/userController.js`

| Function | Description |
|----------|-------------|
| `getProfile` | Get user profile data |
| `updateProfile` | Update profile information |
| `updatePassword` | Change user password |
| `deleteAccount` | Delete user account |

---

#### Password Controller

**File**: `server/src/controllers/passwordController.js`

| Function | Description |
|----------|-------------|
| `forgotPassword` | Send reset email |
| `resetPassword` | Reset with token |
| `verifyResetToken` | Validate reset token |

---

### Middleware

#### Authentication Middleware

**File**: `server/src/middleware/auth.js`

```javascript
export const protect = async (req, res, next) => {
  // Extract token from Authorization header
  // Verify JWT
  // Attach user to request
  // Handle errors
};
```

---

#### Admin Authorization

**File**: `server/src/middleware/adminAuth.js`

```javascript
export const adminAuth = (req, res, next) => {
  // Check if user email matches ADMIN_EMAIL env var
  // Grant or deny access
};
```

---

#### Rate Limiting

**File**: `server/src/middleware/rateLimit.js`

```javascript
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // stricter for auth endpoints
});
```

---

#### Validation Middleware

**File**: `server/src/middleware/validation.js`

```javascript
export const validatePlatformLink = (req, res, next) => {
  // Validate platform enum
  // Validate username format
  // Sanitize input
};
```

---

### External API Utilities

#### LeetCode Fetcher

**File**: `server/src/utils/fetchLeetCode.js`

**GraphQL Query Structure**:

```graphql
query userProfile($username: String!) {
  matchedUser(username: $username) {
    username
    profile { realName, userAvatar, ranking, reputation, ... }
    submitStats { acSubmissionNum { difficulty, count, submissions } }
    badges { id, displayName, icon }
    tagProblemCounts { advanced, intermediate, fundamental }
    userCalendar { streak, totalActiveDays, submissionCalendar }
    languageProblemCount { languageName, problemsSolved }
  }
  userContestRanking(username: $username) {
    rating, globalRanking, topPercentage, badge
  }
  userContestRankingHistory(username: $username) {
    rating, ranking, problemsSolved, contest { title }
  }
}
```

**Returned Data Structure**:

```javascript
{
  // Profile
  username, realName, avatar, ranking, reputation,
  
  // Submissions
  submissionsByDifficulty: {
    easy: { solved, total, submissions },
    medium: { solved, total, submissions },
    hard: { solved, total, submissions },
    all: { solved, total }
  },
  totalSolved, acceptanceRate,
  
  // Tags & Languages
  tagStats, languageStats,
  
  // Streak & Calendar
  streakData: { currentStreak, totalActiveDays, activeYears },
  
  // Contest
  contestRanking: { rating, globalRanking, topPercentage, badge },
  contestHistory: [...],
  
  // Badges
  badges, upcomingBadges, activeBadge,
  
  // Recent Activity
  recentSubmissions, contributions
}
```

---

#### Codeforces Fetcher

**File**: `server/src/utils/fetchCodeforces.js`

**API Endpoints Used**:

| Endpoint | Purpose |
|----------|---------|
| `user.info?handles={username}` | User profile |
| `user.status?handle={username}` | Submission history |
| `user.rating?handle={username}` | Rating changes |

**Returned Data Structure**:

```javascript
{
  // Profile
  handle, rank, rating, maxRank, maxRating,
  avatar, titlePhoto, contribution,
  
  // Submissions
  totalSubmissions, acceptedSubmissions, problemsSolved,
  problemsByRating: { "800": 10, "900": 15, ... },
  languagesUsed: { "C++": 50, "Python": 20, ... },
  verdictDistribution: { "OK": 100, "WRONG_ANSWER": 20, ... },
  
  // Contests
  totalContests, ratingChanges: [...]
}
```

---

#### GitHub Fetcher

**File**: `server/src/utils/fetchGithub.js`

**API Endpoints Used**:

| Endpoint | Purpose |
|----------|---------|
| `/users/{username}` | User profile |
| `/users/{username}/repos` | Repository list |
| `/users/{username}/events` | Activity feed |

**Returned Data Structure**:

```javascript
{
  // Profile
  login, name, bio, company, location, email,
  avatar, followers, following, publicRepos,
  
  // Repository Stats
  totalStars, totalForks, totalWatchers,
  languagesUsed: { "JavaScript": 10, "Python": 5, ... },
  topRepositories: [...],
  recentRepositories: [...],
  
  // Activity
  totalEvents, eventTypes: { "PushEvent": 50, ... },
  recentActivity: [...]
}
```

---

## Frontend Documentation

### Application Entry

**File**: `client/src/main.jsx`

```jsx
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
```

---

### Routing Configuration

**File**: `client/src/App.jsx`

#### Route Types

| Route Type | Component | Description |
|------------|-----------|-------------|
| `PrivateRoute` | Wrapper | Requires authentication |
| `AdminRoute` | Wrapper | Requires admin role |
| `PublicRoute` | Wrapper | Redirects if authenticated |
| `HomeRoute` | Conditional | Dashboard or Landing |

#### Route Definitions

```jsx
<Routes>
  <Route path="/" element={<HomeRoute />} />
  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
  <Route path="/link" element={<PrivateRoute><LinkPlatform /></PrivateRoute>} />
  <Route path="/leetcode" element={<PrivateRoute><LeetCodeDetails /></PrivateRoute>} />
  <Route path="/codeforces" element={<PrivateRoute><CodeforcesDetails /></PrivateRoute>} />
  <Route path="/github" element={<PrivateRoute><GitHubDetails /></PrivateRoute>} />
  <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
  <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
  <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password/:token" element={<ResetPassword />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

---

### Context Providers

#### AuthContext

**Files**: `client/src/context/AuthContext.js`, `client/src/context/AuthProvider.jsx`

```jsx
const AuthContext = createContext();

// Provider State
const [token, setToken] = useState(localStorage.getItem("token"));
const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");

// Exposed Methods
const login = (token, isAdmin) => { ... };
const logout = () => { ... };

// Context Value
<AuthContext.Provider value={{ token, isAdmin, login, logout }}>
```

---

#### SidebarProvider

**File**: `client/src/context/SidebarProvider.jsx`

```jsx
// State
const [isCollapsed, setIsCollapsed] = useState(false);
const [isMobileOpen, setIsMobileOpen] = useState(false);
const [isPlatformsExpanded, setIsPlatformsExpanded] = useState(true);

// Methods
const toggleCollapse = () => { ... };
const closeMobile = () => { ... };
const togglePlatforms = () => { ... };
```

---

### API Client

**File**: `client/src/api/axios.js`

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api",
});

// Request interceptor - attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**Exported API Functions**:

| Function | Description |
|----------|-------------|
| `getMe()` | Get current user |
| `updateProfile(data)` | Update profile |
| `getAllStats()` | Get all platform stats |
| `getStatsSummary()` | Get summary stats |
| `refreshPlatformStats(platform)` | Refresh platform data |

---

### Components

#### AuthenticatedLayout

**File**: `client/src/components/AuthenticatedLayout.jsx`

Wrapper component for authenticated pages providing:
- Responsive sidebar navigation
- Mobile hamburger menu
- Header with branding
- Main content area

---

#### PlatformCard

**File**: `client/src/components/PlatformCard.jsx`

**Props**:

| Prop | Type | Description |
|------|------|-------------|
| `platform` | `"leetcode" \| "codeforces" \| "github"` | Platform type |
| `stats` | `Object` | Platform statistics |
| `username` | `String` | Platform username |
| `progress` | `Number (0-100)` | Progress percentage |
| `canRefresh` | `Boolean` | Refresh availability |
| `nextRefreshAvailable` | `Date` | Next refresh time |
| `onRefresh` | `Function` | Refresh callback |
| `onClick` | `Function` | Click callback |

**Platform Configuration**:

```javascript
const platformConfig = {
  leetcode: {
    name: "LeetCode",
    icon: SiLeetcode,
    color: "#ffa116",
    gradient: "linear-gradient(135deg, #ffa116, #ffb84d)",
    url: (username) => `https://leetcode.com/u/${username}`,
    progressClass: "progress-fill-leetcode",
  },
  codeforces: { ... },
  github: { ... }
};
```

---

#### Dialog Component

**File**: `client/src/components/Dialog.jsx`

Modal dialog for confirmations with:
- Backdrop blur effect
- Animated entry/exit
- Customizable title, message, buttons
- Warning icon styling

---

#### Loader Component

**File**: `client/src/components/Loader.jsx`

Cinematic loading spinner with:
- Layered animated rings
- Core glow effect
- Status text

---

#### Sidebar Component

**File**: `client/src/components/Sidebar.jsx`

Navigation sidebar featuring:
- Collapsible design
- Platform sub-menu with expansion
- Active route highlighting
- Admin route visibility
- Logout functionality

---

#### SummarySection

**File**: `client/src/components/SummarySection.jsx`

Dashboard summary cards showing:
- Platforms tracked count
- Total problems solved
- Combined rating
- Activity score

---

### Pages

#### Landing Page

**File**: `client/src/pages/Landing.jsx`

**Sections**:
1. Hero section with animated background
2. Platform showcase (LeetCode, Codeforces, GitHub)
3. Features grid
4. "How It Works" steps
5. Call-to-action
6. Footer

**Visual Elements**:
- Animated blob backgrounds
- Floating code particles
- Glass-morphism cards
- Gradient text effects
- Hover animations

---

#### Dashboard

**File**: `client/src/pages/Dashboard.jsx`

Main authenticated dashboard with:
- Summary statistics section
- Platform filter buttons
- Platform cards grid
- Individual refresh controls
- Navigate to detail pages

---

#### Platform Detail Pages

##### LeetCodeDetails

**File**: `client/src/pages/LeetCodeDetails.jsx`

**Displayed Data**:
- Username and avatar
- Global ranking and reputation
- Submissions by difficulty (Easy/Medium/Hard)
- Contest rating and history
- Streak data
- Language statistics
- Badges collection

##### CodeforcesDetails

**File**: `client/src/pages/CodeforcesDetails.jsx`

**Displayed Data**:
- Username and rank
- Current and max rating
- Problems solved count
- Contribution score
- Contest history with rating changes
- Rating evolution timeline

##### GitHubDetails

**File**: `client/src/pages/GitHubDetails.jsx`

**Displayed Data**:
- Profile with avatar
- Bio, company, location
- Followers/following counts
- Repository statistics
- Top repositories list
- Language distribution
- Recent activity

---

#### Admin Dashboard

**File**: `client/src/pages/AdminDashboard.jsx`

**Features**:
- Global statistics (total users, platform counts)
- Sync controls for each platform
- "Sync All" button
- Sync results display
- Success/failure tracking table

---

#### Profile Page

**File**: `client/src/pages/Profile.jsx`

**Sections**:
1. Profile information editing
2. Password change form
3. Account deletion with confirmation
4. Success/error messages

---

#### Authentication Pages

| Page | File | Description |
|------|------|-------------|
| Login | `client/src/pages/Login.jsx` | Email/password login form |
| Register | `client/src/pages/Register.jsx` | New user registration |
| ForgotPassword | `client/src/pages/ForgotPassword.jsx` | Password reset request |
| ResetPassword | `client/src/pages/ResetPassword.jsx` | Password reset with token |

---

#### LinkPlatform

**File**: `client/src/pages/LinkPlatform.jsx`

Platform connection interface:
- Platform dropdown (LeetCode, Codeforces, GitHub)
- Username input
- Link button
- Error handling

---

#### NotFound

**File**: `client/src/pages/NotFound.jsx`

404 error page with:
- Large "404" display
- Error message
- Home navigation button

---

## Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, lowercase),
  password: String (bcrypt hashed),
  oneTimeReaddUsed: Map<String, Boolean>,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date
}
```

### PlatformStats Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  platform: "leetcode" | "codeforces" | "github",
  username: String,
  data: Object (raw API response),
  stats: Object (processed statistics),
  lastUpdated: Date,
  lastManualRefresh: Date
}
```

### PlatformActions Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  platform: "leetcode" | "codeforces" | "github",
  action: "link" | "unlink",
  meta: Object,
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Reference

### Authentication Routes

**Base Path**: `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/register` | Register new user | No |
| `POST` | `/login` | User login | No |
| `GET` | `/me` | Get current user | Yes |
| `PUT` | `/profile` | Update profile | Yes |
| `PUT` | `/password` | Change password | Yes |
| `PUT` | `/settings` | Update settings | Yes |

---

### Password Routes

**Base Path**: `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/forgot-password` | Request reset email | No |
| `GET` | `/verify-reset-token/:token` | Validate token | No |
| `POST` | `/reset-password/:token` | Reset password | No |

---

### Platform Routes

**Base Path**: `/api/platforms`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/link` | Link platform account | Yes |
| `GET` | `/` | Get linked platforms | Yes |
| `DELETE` | `/:platform` | Unlink platform | Yes |

---

### Stats Routes

**Base Path**: `/api/stats`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/all` | Get all platform stats | Yes |
| `GET` | `/summary` | Get aggregated summary | Yes |
| `POST` | `/refresh/:platform` | Manual refresh | Yes |

---

### User Routes

**Base Path**: `/api/user`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/profile` | Get profile | Yes |
| `PUT` | `/profile` | Update profile | Yes |
| `PUT` | `/password` | Change password | Yes |
| `DELETE` | `/account` | Delete account | Yes |

---

### Admin Routes

**Base Path**: `/api/admin`

| Method | Endpoint | Description | Auth Required | Admin Required |
|--------|----------|-------------|---------------|----------------|
| `POST` | `/sync/all` | Sync all platforms | Yes | Yes |
| `POST` | `/sync/leetcode` | Sync LeetCode | Yes | Yes |
| `POST` | `/sync/codeforces` | Sync Codeforces | Yes | Yes |
| `POST` | `/sync/github` | Sync GitHub | Yes | Yes |
| `GET` | `/stats` | Get admin stats | Yes | Yes |

---

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server health status |

---

## Authentication & Authorization

### JWT Authentication Flow

```
1. User submits credentials
2. Server validates and generates JWT
3. Client stores token in localStorage
4. Token attached to all requests via interceptor
5. Server middleware validates token
6. User object attached to request
```

### Token Structure

```javascript
{
  id: userId,
  iat: issuedAt,
  exp: expiresIn // 7 days
}
```

### Admin Authorization

Admin is determined by email matching `ADMIN_EMAIL` environment variable:

```javascript
const isAdmin = email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();
```

### Protected Routes (Frontend)

```jsx
const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? (
    <SidebarProvider>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </SidebarProvider>
  ) : (
    <Navigate to="/login" />
  );
};

const AdminRoute = ({ children }) => {
  const { token, isAdmin } = useContext(AuthContext);
  if (!token) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  return (
    <SidebarProvider>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </SidebarProvider>
  );
};
```

---

## Features Deep Dive

### Platform Linking Process

1. **User selects platform** from dropdown
2. **Enters username** for that platform
3. **API validates** username by fetching data
4. **Initial stats** are fetched and stored
5. **PlatformAction** logged for audit
6. **User redirected** to dashboard

### Stats Refresh Mechanism

**User Refresh** (with cooldown):

```javascript
// 15-minute cooldown per platform
const REFRESH_COOLDOWN = 15 * 60 * 1000;

// Check eligibility
const canRefresh = !lastManualRefresh || 
  (Date.now() - lastManualRefresh > REFRESH_COOLDOWN);
```

**Admin Bulk Sync**:

```javascript
// No cooldown for admin
// Iterates all PlatformStat documents
// Updates each with fresh data
// Returns success/failure counts
```

### Progress Calculation

| Platform | Formula | Target |
|----------|---------|--------|
| **LeetCode** | `(totalSolved / 3250) * 100` | ~3250 problems |
| **Codeforces** | `(rating / 3000) * 100` | Grandmaster (3000) |
| **GitHub** | Composite score | Repos, stars, activity |

### Password Reset Flow

1. User requests reset → email sent with token
2. Token hashed and stored with expiry
3. User clicks link → token verified
4. User enters new password
5. Password updated, token invalidated

---

## Styling & Design System

### CSS Architecture

**File**: `client/src/index.css`

### Design Tokens

```css
:root {
  /* Colors defined via Tailwind */
  --bg-primary: #0a0a0f;
  --bg-card: rgba(255, 255, 255, 0.02);
  --text-primary: #ffffff;
  --text-secondary: #9ca3af;
  --accent-blue: #3b82f6;
  --accent-purple: #8b5cf6;
}
```

### Custom Animations

```css
@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

@keyframes text-shine {
  from { background-position: 0% 50%; }
  to { background-position: 100% 50%; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}
```

### Custom Classes

```css
.glass-card {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.glass-card-premium {
  @apply glass-card;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.neon-text {
  text-shadow: 0 0 10px rgba(59, 130, 246, 0.8),
               0 0 20px rgba(139, 92, 246, 0.6);
}

.animate-text-shine {
  background: linear-gradient(90deg, #fff, #60a5fa, #a78bfa, #fff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: text-shine 3s linear infinite;
}
```

### Platform-Specific Gradients

| Platform | Gradient |
|----------|----------|
| **LeetCode** | `linear-gradient(135deg, #ffa116, #ffb84d)` |
| **Codeforces** | `linear-gradient(135deg, #1f8acb, #4cb3f0)` |
| **GitHub** | `linear-gradient(135deg, #8b5cf6, #a78bfa)` |

---

## Environment Configuration

### Server Environment Variables

**File**: `server/.env`

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/devlog

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# CORS
CLIENT_URL=http://localhost:5173
CORS_ALLOW_CREDENTIALS=true

# Email Service (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=delivered@resend.dev

# Vercel Cron
CRON_SECRET=your_cron_secret

# External APIs
CLIST_API_KEY=username:api_key

# Telegram (Optional)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

### Client Environment Variables

**File**: `client/.env`

```env
VITE_BACKEND_URL=http://localhost:5000/api
```

---

## Deployment Guide

### Prerequisites

- Node.js 20.x or higher
- MongoDB 7.x or MongoDB Atlas
- CList API Account for contest data
- Resend API Key for email functionality

### Server Deployment (Vercel)

The server is optimized for Vercel Serverless Functions.

1.  Push your code to GitHub.
2.  Connect your repository to Vercel.
3.  Set the **Root Directory** to `server`.
4.  Configure environment variables in the Vercel Dashboard.
5.  Vercel will automatically use `vercel.json` for routing and cron jobs.

### Client Deployment (Vercel)

1.  Connect the same repository to a new Vercel project.
2.  Set the **Root Directory** to `client`.
3.  Set the **Build Command** to `npm run build`.
4.  Set the **Output Directory** to `dist`.
5.  Add `VITE_BACKEND_URL` to the environment variables.

### Production Considerations

| Consideration | Recommendation |
|---------------|----------------|
| **HTTPS** | Configure SSL/TLS |
| **Environment Variables** | Use secure secrets |
| **Rate Limiting** | Adjust limits for production |
| **CORS** | Restrict to production domains |
| **Database** | Use MongoDB Atlas or managed instance |
| **Logging** | Implement proper logging |
| **Monitoring** | Add health checks and monitoring |

---

## Security Considerations

### Implemented Security Measures

1.  **Password Hashing** - BcryptJS with secure salt rounds.
2.  **JWT Authentication** - Secure tokens with configurable expiry.
3.  **Role-Based Access Control** - Strict separation between `user` and `admin`.
4.  **Helmet.js** - Security headers to prevent XSS, Clickjacking, and other attacks.
5.  **CORS Protection** - Strict origin whitelisting with credentials support.
6.  **Rate Limiting** - Global API and per-route rate limits via `express-rate-limit`.
7.  **Input Sanitization** - Body size limits and validation middleware.
8.  **Compression** - Gzip compression for faster and safer data transfer.
9.  **Secure Password Reset** - Cryptographically secure tokens via Resend.

### Recommendations for Production

| Measure | Description |
|---------|-------------|
| **HTTPS Only** | Enforce SSL |
| **Helmet.js** | Add security headers |
| **MongoDB Security** | Enable authentication |
| **Environment Secrets** | Use secret management |
| **Audit Logging** | Log security events |
| **2FA** | Consider two-factor authentication |
| **API Keys** | For external API rate limits |

---

## Scripts

#### Admin & Migration Scripts

**Directory**: `server/scripts/`

| Script | Command | Description |
|--------|---------|-------------|
| **Make Admin** | `node scripts/makeAdmin.js email@example.com` | Promotes a user to the admin role. |
| **Backfill Actions** | `node scripts/backfillPlatformActions.js` | Migrates legacy data to the new action log. |
| **Migrate User Schema** | `node scripts/migrateUserSchema.js` | Updates user documents for current schema. |

---

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

### Code Style

| Area | Convention |
|------|------------|
| **Linting** | ESLint configuration in `client/eslint.config.js` |
| **Formatting** | Prettier (recommended) |
| **Component naming** | PascalCase |
| **File naming** | camelCase or kebab-case |

---

## License

This project is open source under the [MIT License](LICENSE).

---

## Support

For issues, questions, or contributions:

- 🐛 Open an issue on [GitHub](https://github.com/Shankar-CSE/DevLog/issues)
- 🔀 Active PR: [Develop Branch](https://github.com/Shankar-CSE/DevLog/pull/6)

---

<div align="center">

**Built with ❤️ by [Shankar-CSE](https://github.com/Shankar-CSE)**

</div>
