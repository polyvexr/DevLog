# DevLog

A premium Developer Activity Tracker that aggregates statistics from multiple coding platforms into a single, beautiful dashboard. Track your progress on LeetCode, Codeforces, GitHub, AtCoder, and CodeChef in one place.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-7-646CFF)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC)
![Node](https://img.shields.io/badge/Node-20+-339933)

## 🌐 Live Demo
[Check out DevLog](https://my-devlog.vercel.app)

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based login, registration, and password recovery.
- 📊 **Unified Dashboard** - Aggregate stats from LeetCode, Codeforces, GitHub, AtCoder, and CodeChef.
- 📅 **Contest Calendar** - Stay updated with upcoming contests across all platforms using CList API.
- 👤 **Public Profiles** - Share your coding journey with a customizable public profile link.
- 👑 **Admin Control Panel** - Role-based access to manage users and trigger manual data synchronization.
- 🔄 **Efficient Synchronization** - Unified cron jobs (300s timeout) and manual sync to respect API rate limits.
- 📱 **Fully Responsive** - Premium dark-themed UI built with Tailwind CSS 4.
- 📧 **Email Notifications** - Automated emails for password resets via Resend.
- 🤖 **Telegram Integration** - Optional notifications via Telegram Bot.

## 🚀 Tech Stack

### Frontend
- **Framework:** React 19 + Vite 7
- **Styling:** Tailwind CSS 4 (Utility-first, high performance)
- **Routing:** React Router 7
- **Icons:** React Icons
- **Charts:** Recharts for data visualization
- **State:** Context API

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 5
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + BcryptJS
- **Security:** Helmet, CORS, Express Rate Limit
- **Mailing:** Resend
- **Logging:** Winston
- **Notifications:** Telegram Bot API

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v20 or higher)
- MongoDB (Local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/Shankar-CSE/DevLog.git
cd DevLog
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory using `.env.example`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
RESEND_API_KEY=your_resend_key
RESEND_FROM_EMAIL=your_email
CRON_SECRET=your_cron_secret
CLIST_API_KEY=username:api_key
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```
Start the development server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```
Create a `.env` file in the `client` directory:
```env
VITE_BACKEND_URL=http://localhost:5000/api
```

## 📂 Project Structure

```
DevLog/
├── client/                # Frontend React application
│   ├── src/
│   │   ├── api/          # Axios instance & API calls
│   │   ├── components/   # UI components (PlatformCard, StatCard, etc.)
│   │   ├── context/      # Auth & Sidebar Context Providers
│   │   ├── hooks/        # Custom hooks (useApi, useSidebar)
│   │   ├── pages/        # Dashboard, Details, Auth Pages, etc.
│   │   ├── App.jsx       # Root component & Routing
│   │   └── index.css     # Global styles (Tailwind 4)
│   └── vercel.json        # Frontend deployment config
├── server/                # Backend Express application
│   ├── src/
│   │   ├── config/       # DB connection & Logger setup
│   │   ├── controllers/  # API business logic
│   │   ├── cron/         # Scheduled tasks (Sync, Contests)
│   │   ├── middleware/   # Auth, AdminAuth, RateLimiting
│   │   ├── models/       # Mongoose Schemas (User, Stats, Contests)
│   │   ├── routes/       # Express Route definitions
│   │   ├── services/     # External integrations (Email, Telegram)
│   │   └── utils/        # Fetchers (LeetCode, GitHub, etc.) & Cache
│   ├── api/              # Vercel Serverless Entry (index.js)
│   ├── scripts/          # Admin & Migration scripts
│   └── vercel.json        # Backend deployment & Cron schedule
└── DOCUMENTATION.md      # Comprehensive technical documentation
```

## 🕒 Cron Jobs & Syncing

DevLog uses a unified cron endpoint to manage data synchronization:
- **Endpoint:** `/api/cron/all`
- **Schedule:** Runs daily at midnight (UTC+5:30) via Vercel Crons.
- **Vercel Timeout:** Configured for 300s to handle long-running sync operations.
- **Manual Sync:** Admins can trigger a full sync from the Admin Dashboard.
- **User Sync:** Users can refresh individual platform stats with a cooldown period.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Shankar - [GitHub](https://github.com/Shankar-CSE)

Project Link: [https://github.com/Shankar-CSE/DevLog](https://github.com/Shankar-CSE/DevLog)