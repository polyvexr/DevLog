# DevLog

A premium Professional Skill Record Tracker that combines progress information from multiple programming websites into a single, beautiful overview center. Track your progress on LeetCode, Codeforces, GitHub, AtCoder, and CodeChef in one place.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-7-646CFF)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC)
![Node](https://img.shields.io/badge/Node-20+-339933)

## 🌐 Live Presentation
[Check out DevLog](https://my-devlog.vercel.app)

## ✨ Features

- 🔐 **Secure Identity Verification** - Secure token-based entry, registration, and account recovery.
- 📊 **Single Overview Area** - Consolidate information from LeetCode, Codeforces, GitHub, AtCoder, and CodeChef.
- 📅 **Competition Schedule** - Stay updated with upcoming events across all services using the standard information interface.
- 👤 **Open Profiles** - Share your professional journey with a customizable shared page link.
- 👑 **Management Center** - Permission-based access to manage members and trigger manual information matching.
- 🔄 **Smooth Information Matching** - Standardized scheduled tasks and manual updates to respect service usage boundaries.
- 📱 **Universal Device Support** - Premium dark-themed display interface built with modern styling tools.
- 📧 **Email Notifications** - Automated messages for account resets.
- 🤖 **Messaging Integration** - Optional alerts via messaging services.

## 🚀 Technical Foundation

### Visual System
- **Foundation:** React 19 + Vite 7
- **Styling:** Tailwind CSS 4 (Performance-focused design)
- **Navigation:** Navigation Manager 7
- **Icons:** Visual Symbols
- **Charts:** Information visualization tools
- **State:** Application Memory

### Core Processing System
- **Runtime:** Execution Environment (Modern Standards)
- **Structure:** Web Foundation 5
- **Records System:** Information Storage + Organization Tool
- **Entry Security:** Identity Verification + Security Scrambling
- **Safety:** Security Headers, Shared Resource Rules, Usage Restrictions
- **Mailing:** Email Service
- **Logging:** Activity Record Keeping
- **Notifications:** Alert Service Interface

## 🛠️ Installation & Setup

### Requirements
- Execution Environment (v20 or higher)
- Records System (Local or Cloud)
- Package manager

### 1. Copy the Project
```bash
git clone https://github.com/Shankar-CSE/DevLog.git
cd DevLog
```

### 2. Internal System Setup
```bash
cd server
npm install
```
Create a configuration file in the `server` directory using the template:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_storage_link
JWT_SECRET=your_security_key
CLIENT_URL=http://localhost:5173
RESEND_API_KEY=your_email_key
RESEND_FROM_EMAIL=your_email
CRON_SECRET=your_schedule_key
CLIST_API_KEY=username:api_key
TELEGRAM_BOT_TOKEN=your_alert_token
TELEGRAM_CHAT_ID=your_chat_id
```
Start the creation server:
```bash
npm run dev
```

### 3. Visual System Setup
```bash
cd ../client
npm install
npm run dev
```
Create a configuration file in the `client` directory:
```env
VITE_BACKEND_URL=http://localhost:5000/api
```

## 📂 Project Organization

```
DevLog/
├── client/                # Visual interface application
│   ├── src/
│   │   ├── api/          # Connection tools & data requests
│   │   ├── components/   # Visual elements (Card, Item, etc.)
│   │   ├── context/      # Security & Sidebar Memory
│   │   ├── hooks/        # Custom functions
│   │   ├── pages/        # Overview, Details, Login Pages, etc.
│   │   ├── App.jsx       # Main component & Navigation
│   │   └── index.css     # General styling
│   └── vercel.json        # Publishing configuration
├── server/                # Core processing application
│   ├── src/
│   │   ├── config/       # Storage connection & Record setup
│   │   ├── controllers/  # Logic management
│   │   ├── cron/         # Scheduled tasks
│   │   ├── middleware/   # Security & Safety checks
│   │   ├── models/       # Information Structures
│   │   ├── routes/       # Navigation definitions
│   │   ├── services/     # External connections (Email, Alerts)
│   │   └── utils/        # Data Fetchers & Temporary Memory
│   ├── api/              # Entry Point
│   ├── scripts/          # Management & Transfer scripts
│   └── vercel.json        # Publishing & Schedule settings
└── DOCUMENTATION.md      # Comprehensive professional documentation
```

## 🕒 Scheduled Tasks & Updates

DevLog uses a unified access point to manage information matching:
- **Access Point:** `/api/cron/all`
- **Schedule:** Runs daily at midnight via automated publishing services.
- **Waiting Time:** Configured for 300s to handle long-running updates.
- **Manual Matching:** Managers can trigger a full update from the Management Area.
- **User Update:** Users can refresh individual service records with a waiting period.

## 🤝 Helping Out

Contributions are welcome! Please follow these steps:
1. Copy the Project
2. Create your Work Branch (`git checkout -b feature/AmazingFeature`)
3. Save your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Upload to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Review Request

## 📄 Usage Rules

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Reach Out

Shankar - [GitHub](https://github.com/Shankar-CSE)

Project Link: [https://github.com/Shankar-CSE/DevLog](https://github.com/Shankar-CSE/DevLog)
Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Shankar - [GitHub](https://github.com/Shankar-CSE)

Project Link: [https://github.com/Shankar-CSE/DevLog](https://github.com/Shankar-CSE/DevLog)