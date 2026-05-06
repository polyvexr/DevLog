# DevLog - Complete Project Documentation

> A comprehensive professional activity tracking overview center that combines information from LeetCode, Codeforces, and GitHub.

---

## Table of Contents

- [Project Overview](#project-overview)
- [System Structure](#system-structure)
- [Set of Tools Used](#set-of-tools-used)
- [Project Organization](#project-organization)
- [Internal System Records](#internal-system-records)
  - [Server Entry Point](#server-entry-point)
  - [Storage Settings](#storage-settings)
  - [Information Structures](#information-structures)
  - [Logic Managers](#logic-managers)
  - [Safety & Processing Checks](#safety--processing-checks)
  - [External Service Connectors](#external-service-connectors)
- [Visual Interface Records](#visual-interface-records)
  - [Application Entry](#application-entry)
  - [Navigation Setup](#navigation-setup)
  - [Global Memory Systems](#global-memory-systems)
  - [Connection Tool](#connection-tool)
  - [Visual Elements](#visual-elements)
  - [Pages](#pages)
- [Record Layout](#record-layout)
- [Standard Interface Reference](#standard-interface-reference)
- [Identity Verification & Access Permissions](#identity-verification--access-permissions)
- [Detailed Look at Features](#detailed-look-at-features)
- [Visual Design Standards](#visual-design-standards)
- [Environment Configuration](#environment-configuration)
- [Publishing Instructions](#publishing-instructions)
- [Safety Precautions](#safety-precautions)
- [Utility Commands](#utility-commands)
- [Helping Out](#helping-out)

---

## Project Overview

**DevLog** is a comprehensive professional activity tracking overview center that combines information from multiple major programming websites:

| Service | Description |
|----------|-------------|
| **LeetCode** | Professional programming and interview preparation |
| **Codeforces** | Programming events and contests |
| **GitHub** | Open source collaboration and project storage |
| **AtCoder** | Japanese programming platform |
| **CodeChef** | Indian programming platform |

### Core Value Proposition

- **Unified Overview Center**: Single interface to view all programming activities.
- **Progress Tracking**: Monitor growth across services over time.
- **Competition Schedule**: Stay updated with upcoming events from the standard interface.
- **Open Profiles**: Showcase your information to others via a dedicated link.
- **Management Center**: Manual and automated updates to manage service usage boundaries.
- **Real-time Stats**: Detailed information including tasks completed, ratings, and contributions.
- **Messaging Alerts**: Get notified about your progress and event schedules.

---

## System Structure

### High-Level System Structure

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Visual Client  │────▶│  Core System    │────▶│    Storage      │
│  (Modern Web)   │     │  (Execution)    │     │   (Records)     │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   External Services    │
                    │  - LeetCode Data       │
                    │  - Codeforces Data     │
                    │  - GitHub Data         │
                    └────────────────────────┘
```

### Information Flow

1. **Identity Verification** → Secure token issued
2. **Account Linking** → Username stored, initial data fetch
3. **Information Display** → Cached records from storage
4. **Manual Update** → Manager/User triggered matching with waiting period
5. **Admin Update** → Bulk information matching for all members

---

## Set of Tools Used

### Visual System

| Tool | Version | Purpose |
|------------|---------|---------|
| React | 19.x | Visual Framework |
| Vite | 7.x | Build Tool & Creation Server |
| React Router | 7.x | Client-side Navigation |
| Axios | 1.x | Connection Tool |
| Tailwind CSS | 4.x | Design Tool |
| React Icons | 5.x | Symbol Library |

### Internal System

| Tool | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x+ | Execution Environment |
| Express | 5.x | Web Foundation |
| MongoDB | 7.x+ | Records System |
| Mongoose | 9.x | Organization Tool |
| JWT | - | Identity Verification |
| Bcrypt | 3.x | Security Scrambling |

### External Service Interfaces

| Service | Interface Type | Access Point |
|----------|----------|----------|
| LeetCode | Data Query | `https://leetcode.com/graphql` |
| Codeforces | Request | `https://codeforces.com/api/` |
| GitHub | Request | `https://api.github.com/` |
| AtCoder | Information Scan | `https://atcoder.jp/users/` |
| CodeChef | Request/Scan | `https://www.codechef.com/users/` |

---

## Project Organization

### Complete Directory Tree

```
DevLog/
├── .gitignore
├── README.md
├── DOCUMENTATION.md
│
├── client/                          # Visual Application
│   ├── .env.example                 # Settings template
│   ├── eslint.config.js             # Rule configuration
│   ├── index.html                   # Entry point
│   ├── package.json                 # Project tools
│   ├── vite.config.js               # Creation settings
│   │
│   └── src/
│       ├── App.jsx                  # Root component & navigation
│       ├── main.jsx                 # Application start
│       ├── index.css                # General styles & animations
│       │
│       ├── api/
│       │   └── axios.js             # Connection settings
│       │
│       ├── components/
│       │   ├── AuthenticatedLayout.jsx  # Secure area layout
│       │   ├── ContestCard.jsx          # Event display element
│       │   ├── FullPageLoader.jsx       # General waiting state
│       │   ├── PlatformCard.jsx         # Service information card
│       │   ├── PlatformDetails.jsx      # Detailed service information
│       │   └── Sidebar.jsx              # Navigation menu
│       │
│       ├── context/
│       │   ├── AuthProvider.jsx         # Identity state provider
│       │   └── SidebarProvider.jsx      # Menu state provider
│       │
│       ├── hooks/
│       │   ├── useApi.js                # Global connection hook
│       │   └── useSidebar.js            # Menu custom function
│       │
│       └── pages/
│           ├── AdminDashboard.jsx       # Management control panel
│           ├── AdminUsers.jsx           # Member management
│           ├── Dashboard.jsx            # Main overview
│           ├── Contests.jsx             # Event schedule page
│           ├── PublicProfile.jsx        # Shared information page
│           ├── Settings.jsx             # User preferences & profile
│           ├── LeetCodeDetails.jsx      # Service specific pages...
│           └── ...
│
└── server/                          # Internal Application
    ├── .env                         # Secret settings
    ├── .env.example                 # Settings template
    ├── server.js                    # Application start
    ├── api/
    │   └── index.js                 # Entry point
    │
    ├── src/
    │   ├── config/
    │   │   ├── db.js                # Storage connection
    │   │   └── logger.js            # Record keeping setup
    │   │
    │   ├── controllers/
    │   │   ├── adminController.js   # Management operations
    │   │   ├── contestController.js # Event data management
    │   │   ├── cronController.js    # Update orchestrator
    │   │   ├── statsController.js   # Member information
    │   │   └── ...
    │   │
    │   ├── cron/
    │   │   ├── index.js             # Schedule entry point
    │   │   ├── fetchContests.js     # Background event fetcher
    │   │   └── processSyncJobs.js   # Information matching worker
    │   │
    │   ├── middleware/
    │   │   ├── auth.js              # Identity verification
    │   │   └── adminAuth.js         # Manager permissions
    │   │
    │   ├── models/
    │   │   ├── User.js              # Member & Role structure
    │   │   ├── PlatformStat.js      # Cached service data
    │   │   ├── Contest.js           # Event schedule data
    │   │   └── SyncJob.js           # Tracking update status
    │   │
    │   ├── routes/                  # Navigation paths...
    │   │
    │   ├── services/
    │   │   ├── emailService.js      # Email integration
    │   │   ├── telegramService.js   # Messaging alert integration
    │   │   └── platformService.js   # Core matching logic
    │   │
    │   └── utils/
    │       ├── fetchLeetCode.js     # Service fetchers...
    │       └── cache.js             # Utility for temporary memory
    │
    └── scripts/                     # Utility & Transfer commands
```

---

## Internal System Records

### Server Entry Point

**File**: `server/server.js`

```javascript
// General setup
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";

// Settings
const PORT = process.env.PORT || 5000;
const app = express();

// Processing stack
app.use("/api", apiLimiter);      // Usage restriction
app.use(express.json());           // Data reading
app.use(cors(corsOptions));        // Shared resource rules

// Access point mounting
app.use("/api/auth", authRoutes);
app.use("/api/auth", passwordRoutes);
app.use("/api/platforms", platformRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
```

---

### Storage Settings

**File**: `server/src/config/db.js`

Storage connection using organization tools with shared resources and retry logic.

---

### Information Structures

#### Member Model

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

**Actions**:

| Action | Description |
|--------|-------------|
| `matchPassword` | Compare password with secure record |
| `generateResetToken` | Create password reset token |

**Features**:
- Automatic security scrambling for passwords
- Password comparison tool
- Reset token creation with security tools

---

#### Service Information Structure

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

#### Service Action Structure

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

#### Event Structure

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

#### Update Task Structure

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

### Logic Managers

#### Identity Verification Manager

**File**: `server/src/controllers/authController.js`

| Action | Description |
|----------|-------------|
| `register` | Create new member account |
| `login` | Verify identity, return secure token |
| `getMe` | Get current member profile |
| `updateProfile` | Update member information |
| `updatePassword` | Change password |
| `updateSettings` | Update member preferences |

---

#### Management Area Manager

**File**: `server/src/controllers/adminController.js`

| Action | Description |
|----------|-------------|
| `syncAllPlatforms` | Match all services for all members |
| `syncLeetCode` | Match only LeetCode information |
| `syncCodeforces` | Match only Codeforces information |
| `syncGitHub` | Match only GitHub information |
| `getSyncStats` | Get management overview information |
| `getAllUsers` | List and manage all registered members |

---

#### Event Manager

**File**: `server/src/controllers/contestController.js`

| Action | Description |
|----------|-------------|
| `getUpcomingContests` | Retrieve upcoming events from storage |
| `refreshContests` | Trigger background fetch from external source |

---

#### Schedule Manager

**File**: `server/src/controllers/cronController.js`

| Action | Description |
|----------|-------------|
| `handleUnifiedCron` | Orchestrates daily matching and event fetching |
| `triggerSyncQueue` | Manually starts the background matching worker |

---

#### Shared Page Manager

**File**: `server/src/controllers/publicProfileController.js`

| Action | Description |
|----------|-------------|
| `getPublicProfile` | Fetches public information for a specific member |
| `getPublicStats` | Returns specific service information for public view |

---

#### Overview Manager

**File**: `server/src/controllers/dashboardController.js`

| Action | Description |
|----------|-------------|
| `getUserDashboard` | Combines all member information for the home page |

---

#### Information Manager

**File**: `server/src/controllers/statsController.js`

| Action | Description |
|----------|-------------|
| `getAllStats` | Get all service information for member |
| `getStatsSummary` | Get consolidated summary |
| `refreshPlatformStats` | Manual update with waiting period |

**Progress Calculation**:

```javascript
const calculateProgress = (platform, stats) => {
  switch (platform) {
    case "leetcode":
      // Progress = (solved / total) * 100
      return Math.min(Math.round((totalSolved / 3250) * 100), 100);
    case "codeforces":
      // Progress = (rating / 3000) * 100 (target level)
      return Math.min(Math.round((rating / 3000) * 100), 100);
    case "github":
      // Based on projects, stars, contributions
      // Custom method
  }
};
```

---

#### Service Manager

**File**: `server/src/controllers/platformController.js`

| Action | Description |
|----------|-------------|
| `linkPlatform` | Link external service account |
| `getPlatforms` | Get linked services |
| `unlinkPlatform` | Remove service connection |

---

#### Member Information Manager

**File**: `server/src/controllers/userController.js`

| Action | Description |
|----------|-------------|
| `getProfile` | Get member information |
| `updateProfile` | Update profile information |
| `updatePassword` | Change member password |
| `deleteAccount` | Remove member account |

---

#### Password Manager

**File**: `server/src/controllers/passwordController.js`

| Action | Description |
|----------|-------------|
| `forgotPassword` | Send reset message |
| `resetPassword` | Reset with secure token |
| `verifyResetToken` | Validate reset token |

---

### Safety & Processing Checks

#### Identity Verification Check

**File**: `server/src/middleware/auth.js`

```javascript
export const protect = async (req, res, next) => {
  // Extract token from verification area
  // Verify secure token
  // Attach member to request
  // Handle errors
};
```

---

#### Manager Permission Check

**File**: `server/src/middleware/adminAuth.js`

```javascript
export const adminAuth = (req, res, next) => {
  // Check if member email matches MANAGER_EMAIL setting
  // Grant or deny access
};
```

---

#### Usage Restriction

**File**: `server/src/middleware/rateLimit.js`

```javascript
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP address
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // stricter for security access points
});
```

---

#### Validation Check

**File**: `server/src/middleware/validation.js`

```javascript
export const validatePlatformLink = (req, res, next) => {
  // Validate service type
  // Validate username format
  // Clean up input
};
```

---

### External Service Connectors

#### LeetCode Connector

**File**: `server/src/utils/fetchLeetCode.js`

**Data Request Structure**:

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

**Information Returned**:

```javascript
{
  // Profile
  username, realName, avatar, ranking, reputation,
  
  // Tasks Completed
  submissionsByDifficulty: {
    easy: { solved, total, submissions },
    medium: { solved, total, submissions },
    hard: { solved, total, submissions },
    all: { solved, total }
  },
  totalSolved, acceptanceRate,
  
  // Topics & Languages
  tagStats, languageStats,
  
  // Consistency & Calendar
  streakData: { currentStreak, totalActiveDays, activeYears },
  
  // Competition
  contestRanking: { rating, globalRanking, topPercentage, badge },
  contestHistory: [...],
  
  // Achievements
  badges, upcomingBadges, activeBadge,
  
  // Recent Activity
  recentSubmissions, contributions
}
```

---

#### Codeforces Connector

**File**: `server/src/utils/fetchCodeforces.js`

**Service Access Points Used**:

| Access Point | Purpose |
|----------|---------|
| `user.info?handles={username}` | Member information |
| `user.status?handle={username}` | Task history |
| `user.rating?handle={username}` | Rating changes |

**Information Returned**:

```javascript
{
  // Profile
  handle, rank, rating, maxRank, maxRating,
  avatar, titlePhoto, contribution,
  
  // Tasks Completed
  totalSubmissions, acceptedSubmissions, problemsSolved,
  problemsByRating: { "800": 10, "900": 15, ... },
  languagesUsed: { "C++": 50, "Python": 20, ... },
  verdictDistribution: { "OK": 100, "WRONG_ANSWER": 20, ... },
  
  // Events
  totalContests, ratingChanges: [...]
}
```

---

#### GitHub Connector

**File**: `server/src/utils/fetchGithub.js`

**Service Access Points Used**:

| Access Point | Purpose |
|----------|---------|
| `/users/{username}` | Member information |
| `/users/{username}/repos` | Project list |
| `/users/{username}/events` | Activity feed |

**Information Returned**:

```javascript
{
  // Profile
  login, name, bio, company, location, email,
  avatar, followers, following, publicRepos,
  
  // Project Information
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

## Visual Interface Records

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

### Navigation Setup

**File**: `client/src/App.jsx`

#### Area Types

| Area Type | Component | Description |
|------------|-----------|-------------|
| `PrivateRoute` | Wrapper | Requires identity verification |
| `AdminRoute` | Wrapper | Requires manager permission |
| `PublicRoute` | Wrapper | Redirects if already verified |
| `HomeRoute` | Conditional | Overview or Welcome Page |

#### Path Definitions

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
  <Route path="/reset-pass  <Route path="/reset-password/:token" element={<ResetPassword />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

---

### Global Memory Systems

#### Identity Verification Memory

**Files**: `client/src/context/AuthContext.js`, `client/src/context/AuthProvider.jsx`

```jsx
const AuthContext = createContext();

// Memory State
const [token, setToken] = useState(localStorage.getItem("token"));
const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");

// Provided Actions
const login = (token, isAdmin) => { ... };
const logout = () => { ... };

// Memory Value
<AuthContext.Provider value={{ token, isAdmin, login, logout }}>
```

---

#### Navigation Menu Memory

**File**: `client/src/context/SidebarProvider.jsx`

```jsx
// State
const [isCollapsed, setIsCollapsed] = useState(false);
const [isMobileOpen, setIsMobileOpen] = useState(false);
const [isPlatformsExpanded, setIsPlatformsExpanded] = useState(true);

// Actions
const toggleCollapse = () => { ... };
const closeMobile = () => { ... };
const togglePlatforms = () => { ... };
```

---

### Connection Tool

**File**: `client/src/api/axios.js`

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api",
});

// Request interceptor - attach secure token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**Exported Connection Actions**:

| Action | Description |
|----------|-------------|
| `getMe()` | Get current member |
| `updateProfile(data)` | Update profile information |
| `getAllStats()` | Get all service information |
| `getStatsSummary()` | Get consolidated information |
| `refreshPlatformStats(platform)` | Update service information |

---

### Visual Elements

#### Secure Layout

**File**: `client/src/components/AuthenticatedLayout.jsx`

Wrapper element for secure pages providing:
- Adjustable navigation menu
- Mobile access menu
- Header with branding
- Main information area

---

#### Service Card

**File**: `client/src/components/PlatformCard.jsx`

**Settings**:

| Setting | Type | Description |
|------|------|-------------|
| `platform` | `"leetcode" \| "codeforces" \| "github"` | Service type |
| `stats` | `Object` | Service information |
| `username` | `String` | Service username |
| `progress` | `Number (0-100)` | Completion percentage |
| `canRefresh` | `Boolean` | Update availability |
| `nextRefreshAvailable` | `Date` | Next update time |
| `onRefresh` | `Function` | Update action |
| `onClick` | `Function` | Select action |

**Service Setup**:

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

#### Message Box Element

**File**: `client/src/components/Dialog.jsx`

Visual message box for confirmations with:
- Blurred background effect
- Smooth entry/exit movement
- Customizable title, message, and buttons
- Warning symbol styling

---

#### Waiting Symbol Element

**File**: `client/src/components/Loader.jsx`

Visual waiting symbol with:
- Layered moving rings
- Central glow effect
- Status message

---

#### Navigation Menu Element

**File**: `client/src/components/Sidebar.jsx`

Navigation menu featuring:
- Adjustable design
- Service sub-menu with expansion
- Active path highlighting
- Manager path visibility
- Account exit action

---

#### Summary Area

**File**: `client/src/components/SummarySection.jsx`

Overview summary cards showing:
- Services tracked count
- Total tasks completed
- Combined level
- Activity score

---

### Viewable Pages

#### Welcome Page

**File**: `client/src/pages/Landing.jsx`

**Sections**:
1. Main introduction area with animated background
2. Service showcase (LeetCode, Codeforces, GitHub)
3. Features overview
4. "How It Works" steps
5. Engagement button
6. Footer

**Visual Elements**:
- Moving background shapes
- Floating decorative particles
- Blurred card designs
- Colorful text effects
- Interaction animations

---

#### Overview Center

**File**: `client/src/pages/Dashboard.jsx`

Main secure overview with:
- Consolidated information section
- Service filtering buttons
- Service cards grid
- Individual update controls
- Access to detailed information pages

---

### Service Detailed Information Pages

##### LeetCode Details

**File**: `client/src/pages/LeetCodeDetails.jsx`

**Displayed Information**:
- Username and profile image
- Global standing and reputation
- Tasks completed by difficulty
- Competition level and history
- Consistency data
- Language information
- Achievement collection

##### Codeforces Details

**File**: `client/src/pages/CodeforcesDetails.jsx`

**Displayed Information**:
- Username and rank
- Current and maximum level
- Tasks completed count
- Contribution score
- Event history with level changes
- Level progress timeline

##### GitHub Details

**File**: `client/src/pages/GitHubDetails.jsx`

**Displayed Information**:
- Profile with image
- Bio, company, location
- Interaction counts
- Project statistics
- Top projects list
- Programming language distribution
- Recent activity

---

#### Management Area

**File**: `client/src/pages/AdminDashboard.jsx`

**Features**:
- General statistics (total members, service counts)
- Matching controls for each service
- "Match All" button
- Update results display
- Performance tracking table

---

#### Personal Profile Page

**File**: `client/src/pages/Profile.jsx`

**Sections**:
1. Member information editing
2. Password change form
3. Account removal with confirmation
4. Result messages

---

#### Entry Verification Pages

| Page | File | Description |
|------|------|-------------|
| Login | `client/src/pages/Login.jsx` | Email/password entry form |
| Register | `client/src/pages/Register.jsx` | New member registration |
| Forgot Password | `client/src/pages/ForgotPassword.jsx` | Password reset request |
| Reset Password | `client/src/pages/ResetPassword.jsx` | Password reset with token |

---

#### Link Service

**File**: `client/src/pages/LinkPlatform.jsx`

Service connection interface:
- Service selection (LeetCode, Codeforces, GitHub)
- Username input
- Connection button
- Error handling

---

#### Page Not Found

**File**: `client/src/pages/NotFound.jsx`

Error page with:
- Large "404" message
- Error explanation
- Home navigation button

---

### Record Layout

#### Members Information Group

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (secured),
  oneTimeReaddUsed: Map<String, Boolean>,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date
}
```

#### Service Information Group

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Member),
  platform: "leetcode" | "codeforces" | "github",
  username: String,
  data: Object (raw information),
  stats: Object (processed information),
  lastUpdated: Date,
  lastManualRefresh: Date
}
```

#### Service Actions Group

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Member),
  platform: "leetcode" | "codeforces" | "github",
  action: "link" | "unlink",
  meta: Object,
  createdAt: Date,
  updatedAt: Date
}
```

---

### Standard Interface Reference

#### Identity Verification Routes

**Main Path**: `/api/auth`

| Action Type | Access Point | Description | Identity Verification Needed |
|--------|----------|-------------|---------------|
| `POST` | `/register` | Register new member | No |
| `POST` | `/login` | Member login | No |
| `GET` | `/me` | Get current member | Yes |
| `PUT` | `/profile` | Update profile information | Yes |
| `PUT` | `/password` | Change password | Yes |
| `PUT` | `/settings` | Update preferences | Yes |

---

#### Password Routes

**Main Path**: `/api/auth`

| Action Type | Access Point | Description | Identity Verification Needed |
|--------|----------|-------------|---------------|
| `POST` | `/forgot-password` | Request reset message | No |
| `GET` | `/verify-reset-token/:token` | Validate token | No |
| `POST` | `/reset-password/:token` | Reset password | No |

---

#### Service Routes

**Main Path**: `/api/platforms`

| Action Type | Access Point | Description | Identity Verification Needed |
|--------|----------|-------------|---------------|
| `POST` | `/link` | Link service account | Yes |
| `GET` | `/` | Get linked services | Yes |
| `DELETE` | `/:platform` | Unlink service | Yes |

---

#### Information Routes

**Main Path**: `/api/stats`

| Action Type | Access Point | Description | Identity Verification Needed |
|--------|----------|-------------|---------------|
| `GET` | `/all` | Get all service information | Yes |
| `GET` | `/summary` | Get consolidated summary | Yes |
| `POST` | `/refresh/:platform` | Manual update | Yes |

---

#### Member Routes

**Main Path**: `/api/user`

| Action Type | Access Point | Description | Identity Verification Needed |
|--------|----------|-------------|---------------|
| `GET` | `/profile` | Get member information | Yes |
| `PUT` | `/profile` | Update information | Yes |
| `PUT` | `/password` | Change password | Yes |
| `DELETE` | `/account` | Remove account | Yes |

---

#### Management Routes

**Main Path**: `/api/admin`

| Action Type | Access Point | Description | Identity Verification Needed | Manager Permission Needed |
|--------|----------|-------------|---------------|----------------|
| `POST` | `/sync/all` | Match all services | Yes | Yes |
| `POST` | `/sync/leetcode` | Match LeetCode | Yes | Yes |
| `POST` | `/sync/codeforces` | Match Codeforces | Yes | Yes |
| `POST` | `/sync/github` | Match GitHub | Yes | Yes |
| `GET` | `/stats` | Get management information | Yes | Yes |

---

#### System Status Check

| Action Type | Access Point | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Overall system status |

---

### Identity Verification & Access Permissions

#### Secure Access Flow

```
1. Member submits credentials
2. Server validates and creates secure token
3. Client stores token in local memory
4. Token attached to all requests via automated tool
5. Server checks token validity
6. Member information attached to request
```

#### Secure Token Structure

```javascript
{
  id: userId,
  iat: issuedAt,
  exp: expiresIn // 7 days
}
```

#### Manager Permissions

Manager status is determined by matching the email with the `MANAGER_EMAIL` setting:

```javascript
const isAdmin = email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();
```

#### Secure Areas (Visual System)

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

### Detailed Look at Features

#### Service Linking Process

1. **Member selects service** from menu
2. **Enters username** for that service
3. **Internal system checks** username by fetching information
4. **Initial information** is fetched and stored
5. **Service Action** recorded for tracking
6. **Member redirected** to overview center

#### Information Matching System

**Member Update** (with waiting period):

```javascript
// 15-minute waiting period per service
const REFRESH_COOLDOWN = 15 * 60 * 1000;

// Check if update is allowed
const canRefresh = !lastManualRefresh || 
  (Date.now() - lastManualRefresh > REFRESH_COOLDOWN);
```

**Manager Bulk Matching**:

```javascript
// No waiting period for manager
// Checks all service information records
// Updates each with fresh information
// Returns success/failure counts
```

#### Progress Calculation

| Service | Method | Target |
|----------|---------|--------|
| **LeetCode** | `(totalSolved / 3250) * 100` | ~3250 tasks |
| **Codeforces** | `(rating / 3000) * 100` | High Level (3000) |
| **GitHub** | Combined total | Projects, stars, activity |

#### Password Reset Flow

1. Member requests reset → email sent with secure token
2. Token secured and stored with expiration time
3. Member clicks link → token verified
4. Member enters new password
5. Password updated, token deactivated

---

### Visual Design Standards

#### Design System Structure

**File**: `client/src/index.css`

#### Design Values

```css
:root {
  /* Colors defined via styling tool */
  --bg-primary: #0a0a0f;
  --bg-card: rgba(255, 255, 255, 0.02);
  --text-primary: #ffffff;
  --text-secondary: #9ca3af;
  --accent-blue: #3b82f6;
  --accent-purple: #8b5cf6;
}
```

#### Visual Motion Effects

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

#### Visual Templates

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

#### Service Gradients

| Service | Gradient |
|----------|----------|
| **LeetCode** | `linear-gradient(135deg, #ffa116, #ffb84d)` |
| **Codeforces** | `linear-gradient(135deg, #1f8acb, #4cb3f0)` |
| **GitHub** | `linear-gradient(135deg, #8b5cf6, #a78bfa)` |

---

### System Settings

#### Internal System Settings

**File**: `server/.env`

```env
# System Configuration
PORT=5000
NODE_ENV=development

# Storage
MONGO_URI=mongodb://localhost:27017/devlog

# Identity Verification
JWT_SECRET=your_super_secure_key

# Shared Resource Rules
CLIENT_URL=http://localhost:5173
CORS_ALLOW_CREDENTIALS=true

# Email Service
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=delivered@resend.dev

# Scheduled Tasks
CRON_SECRET=your_schedule_secret

# External Services
CLIST_API_KEY=username:api_key

# Messaging Alerts (Optional)
TELEGRAM_BOT_TOKEN=your_alert_token
TELEGRAM_CHAT_ID=your_chat_id
```

#### Visual System Settings

**File**: `client/.env`

```env
VITE_BACKEND_URL=http://localhost:5000/api
```

---

### Publishing Instructions

#### Requirements

- Execution Environment 20.x or higher
- Records System (Local or Cloud)
- External Service Account for event data
- Email Service Key for messaging functionality

#### Publishing the Internal System

The system is optimized for automated publishing services.

1.  Upload your code.
2.  Connect your storage.
3.  Set the main folder to `server`.
4.  Configure system settings in the management panel.
5.  The service will automatically use the publishing settings for navigation and scheduled tasks.

#### Publishing the Visual System

1.  Connect the same storage to a new publishing project.
2.  Set the main folder to `client`.
3.  Set the creation command to `npm run build`.
4.  Set the final folder to `dist`.
5.  Add the internal system address to the settings.

#### Public Launch Advice

| Advice | Recommendation |
|---------------|----------------|
| **Security** | Configure secure connection |
| **Settings** | Use secure keys |
| **Usage Limits** | Adjust limits for public use |
| **Resource Rules** | Restrict to public domains |
| **Storage** | Use cloud-based records |
| **Record Keeping** | Implement proper activity logs |
| **Status Check** | Add health checks and monitoring |

---

### Safety Precautions

#### Safety Actions Taken

1.  **Security Scrambling** - Automatic scrambling with secure rounds.
2.  **Identity Verification** - Secure tokens with configurable expiration.
3.  **Permission-Based Access** - Strict separation between `member` and `manager`.
4.  **Security Headers** - Protection to prevent common online attacks.
5.  **Access Rules** - Strict rules for sharing resources.
6.  **Usage Restriction** - Overall system and per-path limits.
7.  **Data Cleaning** - Size limits and validation checks.
8.  **Compression** - Faster and safer information transfer.
9.  **Secure Password Reset** - Cryptographically secure methods for reset messages.

#### Recommendations for Public Launch

| Measure | Description |
|---------|-------------|
| **Secure Connection** | Enforce secure links |
| **Security Headers** | Add extra protection |
| **Storage Security** | Enable verification |
| **Secret Management** | Use secure key storage |
| **Activity Tracking** | Log security events |
| **Extra Verification** | Consider two-factor authentication |
| **Service Keys** | For external usage limits |

---

### Utility Commands

#### Management & Transfer Commands

**Directory**: `server/scripts/`

| Command | Usage | Description |
|--------|---------|-------------|
| **Make Manager** | `node scripts/makeAdmin.js email@example.com` | Promotes a member to the manager role. |
| **Update History** | `node scripts/backfillPlatformActions.js` | Transfers old data to the new activity log. |
| **Update Member Structure** | `node scripts/migrateUserSchema.js` | Updates member records for current layout. |

---

### Helping Out

1. Copy the project
2. Create work branch: `git checkout -b feature/AmazingFeature`
3. Save changes: `git commit -m 'Add AmazingFeature'`
4. Upload branch: `git push origin feature/AmazingFeature`
5. Open Review Request

### Presentation Rules

| Area | Rule |
|------|------------|
| **Style Checking** | Automated checks configured |
| **Formatting** | Standardized presentation |
| **Component naming** | Clear and consistent names |
| **File naming** | Standardized file names |

---

### Usage Rules

This project is open source under the [MIT License](LICENSE).

---

### Support

For issues, questions, or contributions:--

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
