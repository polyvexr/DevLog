# DevLog

A comprehensive developer activity tracker that aggregates statistics from LeetCode, Codeforces, and GitHub platforms. Features admin-controlled data synchronization for efficient API usage management.

## Features

- 🔐 **User Authentication** - Secure registration and login
- 🔗 **Platform Integration** - Connect LeetCode, Codeforces, and GitHub accounts
- 📊 **Statistics Dashboard** - View detailed stats from all platforms
- 👑 **Admin Dashboard** - Manual control for data synchronization
- 🎯 **Role-Based Access** - Separate views for admin and normal users
- 💾 **MongoDB Storage** - Persistent data storage
- 🚀 **Manual Sync** - Admin-controlled updates to prevent API rate limits

## Tech Stack

### Frontend

- React + Vite
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- Context API for state management

### Backend

- Node.js + Express
- MongoDB with Mongoose
- JWT authentication
- Bcrypt for password hashing
- Admin middleware for protected routes

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd DevLog
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/devlog
JWT_SECRET=your-secret-key-here

# Admin Configuration
ADMIN_EMAIL=admin@example.com
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

### 4. Create Admin Account

1. Go to `http://localhost:5173/register`
2. Register with the email that matches `ADMIN_EMAIL` in your `.env`
3. Login with those credentials
4. You'll be redirected to the Admin Dashboard

## User Flows

### Normal User:

1. **Register** → Create account
2. **Login** → Access dashboard
3. **Link Platforms** → Add platform usernames
4. **View Stats** → See statistics (updated by admin)

### Admin User:

1. **Register** with `ADMIN_EMAIL`
2. **Login** → Access Admin Dashboard
3. **Sync Data** → Trigger manual updates:
   - Sync all platforms at once
   - Sync individual platforms
4. **Monitor** → View sync results and statistics

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Platforms (Protected)

- `POST /api/platforms/link` - Link a platform account
- `GET /api/platforms` - Get user's linked platforms

### Stats (Protected)

- `GET /api/stats` - Get user's platform statistics

### Admin (Protected + Admin Only)

- `GET /api/admin/stats` - Get admin statistics
- `POST /api/admin/sync/all` - Sync all platforms for all users
- `POST /api/admin/sync/leetcode` - Sync LeetCode only
- `POST /api/admin/sync/codeforces` - Sync Codeforces only
- `POST /api/admin/sync/github` - Sync GitHub only

## Project Structure

```
DevLog/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── api/           # API configuration
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React Context (Auth)
│   │   ├── pages/         # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── ...
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/                # Backend Express app
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── controllers/  # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── adminController.js
│   │   │   └── ...
│   │   ├── middleware/   # Custom middleware
│   │   │   ├── auth.js
│   │   │   └── adminAuth.js
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   │   ├── admin.js
│   │   │   └── ...
│   │   └── utils/        # Utility functions
│   │       ├── fetchLeetCode.js
│   │       ├── fetchCodeforces.js
│   │       └── fetchGithub.js
│   ├── server.js
│   └── package.json
├── ADMIN_GUIDE.md        # Detailed admin documentation
└── README.md
```

## Key Changes from Previous Version

### Removed:

- ❌ Automatic cron jobs
- ❌ Background data fetching
- ❌ `node-cron` dependency usage

### Added:

- ✅ Admin authentication middleware
- ✅ Manual sync controls
- ✅ Admin dashboard page
- ✅ Role-based routing
- ✅ Sync result tracking
- ✅ Admin statistics view

## Environment Variables

### Server (.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/devlog
JWT_SECRET=your-secret-key
ADMIN_EMAIL=admin@example.com
CLIENT_ORIGIN=http://localhost:5173
```

## Security Features

- JWT-based authentication
- Bcrypt password hashing
- Admin-only route protection
- CORS configuration
- Environment variable protection

## Admin Guide

For detailed admin functionality documentation, see [ADMIN_GUIDE.md](./ADMIN_GUIDE.md)

Topics covered:

- Admin setup and configuration
- User flow comparison
- API endpoint details
- Security notes
- Troubleshooting guide

## Development

### Run in Development Mode

Terminal 1 (Backend):

```bash
cd server
npm run dev
```

Terminal 2 (Frontend):

```bash
cd client
npm run dev
```

### Build for Production

Frontend:

```bash
cd client
npm run build
```

The build will be created in `client/dist` and can be served by the Express backend.

## Troubleshooting

### Admin Access Issues

- Verify `ADMIN_EMAIL` in `.env` matches your registered email
- Clear localStorage and login again
- Check browser console for errors

### Sync Failures

- Check API rate limits (especially GitHub)
- Verify usernames are correct
- Review error details in admin dashboard

### Database Connection

- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- Verify network connectivity

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues, questions, or contributions, please open an issue on GitHub.
