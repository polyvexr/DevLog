# Admin Configuration Guide

## Overview

This project now uses **manual admin control** instead of automatic cron jobs. Only the admin user can trigger data synchronization for all users.

## Setup Instructions

### 1. Configure Admin Credentials

Add these environment variables to your `server/.env` file:

```env
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=your-secure-admin-password
```

### 2. Create Admin Account

The admin user must be registered like any other user, but the email **must match** the `ADMIN_EMAIL` in your `.env` file.

Steps:

1. Go to the registration page
2. Register with the email that matches `ADMIN_EMAIL`
3. Use any password you want (this will be your actual password)
4. Login with these credentials

### 3. Admin Access

When the admin user logs in:

- They will be automatically redirected to `/admin` (Admin Dashboard)
- A "🔧 Admin" link will appear in the navbar
- Normal users will only see the regular dashboard

## User Flow

### Normal User Flow:

1. **Register** → Create account with email and password
2. **Login** → Redirected to Dashboard (`/`)
3. **Link Platforms** → Add LeetCode, Codeforces, GitHub usernames
4. **View Stats** → See their platform statistics
5. **Wait for Admin** → Stats are only updated when admin syncs data

### Admin User Flow:

1. **Register** → Create account with `ADMIN_EMAIL`
2. **Login** → Redirected to Admin Dashboard (`/admin`)
3. **View Statistics** → See total users and platform counts
4. **Sync Data** → Click buttons to sync platform data:
   - **Sync All Platforms** → Updates all platforms for all users
   - **Sync LeetCode** → Updates only LeetCode data
   - **Sync Codeforces** → Updates only Codeforces data
   - **Sync GitHub** → Updates only GitHub data
5. **Monitor Results** → View success/failure counts and details

## API Endpoints

### Admin Endpoints (Require Admin Auth)

All admin endpoints require:

- Valid JWT token (from login)
- User email must match `ADMIN_EMAIL`

#### Get Admin Stats

```
GET /api/admin/stats
```

Returns:

- Total user count
- Platform user counts
- Recent sync history

#### Sync All Platforms

```
POST /api/admin/sync/all
```

Syncs all platforms for all users.

#### Sync Individual Platforms

```
POST /api/admin/sync/leetcode
POST /api/admin/sync/codeforces
POST /api/admin/sync/github
```

Syncs specific platform for all users who have linked it.

### Response Format

```json
{
  "success": true,
  "message": "Sync completed",
  "results": {
    "total": 10,
    "success": 8,
    "failed": 2,
    "details": [
      {
        "user": "user@example.com",
        "platform": "leetcode",
        "status": "success"
      },
      {
        "user": "user2@example.com",
        "platform": "leetcode",
        "status": "failed",
        "error": "Username not found"
      }
    ]
  }
}
```

## Changes from Previous Version

### Removed:

- ❌ All cron jobs (`src/cron/` directory)
- ❌ `node-cron` dependency (can be removed from package.json if desired)
- ❌ Automatic background data fetching

### Added:

- ✅ Admin middleware (`src/middleware/adminAuth.js`)
- ✅ Admin controller (`src/controllers/adminController.js`)
- ✅ Admin routes (`src/routes/admin.js`)
- ✅ Admin Dashboard page (`client/src/pages/AdminDashboard.jsx`)
- ✅ Admin detection in login
- ✅ Protected admin routes
- ✅ Manual sync controls

## Security Notes

1. **Admin Email Protection**: Only users with email matching `ADMIN_EMAIL` can access admin endpoints
2. **JWT Required**: All admin actions require valid authentication token
3. **Environment Variables**: Keep `ADMIN_EMAIL` secure and don't commit to git
4. **Password**: The admin account password is stored in the database like any user (bcrypt hashed)

## Troubleshooting

### "Admin access required" Error

- Ensure `ADMIN_EMAIL` is set in `.env`
- Verify logged-in user's email matches `ADMIN_EMAIL`
- Check that you're logged in (have valid token)

### Admin Dashboard Not Showing

- Clear localStorage and login again
- Verify `isAdmin` flag is set in localStorage
- Check browser console for errors

### Sync Failures

- Check API rate limits (especially for GitHub)
- Verify usernames are correct
- Check network connectivity
- Review error details in sync results table

## Development Notes

For development, you might want to:

1. Use a test email as `ADMIN_EMAIL`
2. Create multiple test accounts to simulate users
3. Link different platforms to test accounts
4. Test sync functionality with the admin account

## Production Deployment

Before deploying:

1. Set strong `ADMIN_EMAIL` and `JWT_SECRET` in production `.env`
2. Ensure admin user is created with secure password
3. Verify environment variables are properly loaded
4. Test admin sync functionality
5. Monitor sync success rates
