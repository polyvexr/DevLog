# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Environment Setup (1 min)

Create `server/.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/devlog
JWT_SECRET=my-super-secret-jwt-key-change-this-in-production
ADMIN_EMAIL=admin@devlog.com
CLIENT_ORIGIN=http://localhost:5173
```

### Step 2: Install Dependencies (2 min)

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies (in new terminal)
cd client
npm install
```

### Step 3: Start the Application (1 min)

Terminal 1 - Backend:

```bash
cd server
npm run dev
```

Terminal 2 - Frontend:

```bash
cd client
npm run dev
```

### Step 4: Create Admin Account (1 min)

1. Open browser: `http://localhost:5173`
2. Click "Create one" (Register)
3. Register with:
   - Email: `admin@devlog.com` (must match ADMIN_EMAIL in .env)
   - Password: Your choice
   - Name: Your name

### Step 5: Login as Admin

1. Login with the credentials you just created
2. You'll be automatically redirected to Admin Dashboard
3. You'll see:
   - Statistics overview
   - Sync control buttons
   - Admin navigation link

## 🎯 What You Can Do Now

### As Admin:

1. **View Statistics**: See total users and platform counts
2. **Sync Data**: Click sync buttons to update user data
   - "Sync All Platforms" - Updates everything
   - "Sync LeetCode" - Updates only LeetCode
   - "Sync Codeforces" - Updates only Codeforces
   - "Sync GitHub" - Updates only GitHub
3. **Monitor Results**: View success/failure counts after sync
4. **Access All Features**: Use both admin and normal user features

### Create Test Users:

1. Logout from admin
2. Register new user with different email (e.g., `user@test.com`)
3. Login as that user
4. Link platforms (LeetCode, Codeforces, GitHub usernames)
5. View empty stats (no data yet)
6. Logout and login as admin
7. Click "Sync All Platforms"
8. Logout and login as test user
9. See updated stats!

## 📋 Quick Commands

```bash
# Start backend
cd server && npm run dev

# Start frontend
cd client && npm run dev

# Check backend
curl http://localhost:5000/api/auth/login

# MongoDB (if local)
mongod

# View logs
# Check terminal outputs
```

## 🔧 Troubleshooting

### MongoDB Connection Error

```bash
# Start MongoDB
sudo systemctl start mongod
# OR if using Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### Port Already in Use

```bash
# Kill process on port 5000
sudo lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
sudo lsof -ti:5173 | xargs kill -9
```

### Cannot Access Admin Dashboard

- Check `ADMIN_EMAIL` in `.env` matches your registered email
- Clear browser localStorage (F12 → Application → Local Storage → Clear)
- Login again

### Sync Not Working

- Ensure you've linked platforms as a test user first
- Check internet connection
- Verify platform usernames are correct
- Check terminal for error messages

## 🎨 Default Login URLs

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- Admin Dashboard: `http://localhost:5173/admin`

## 📝 Test Credentials

Create these for testing:

**Admin:**

- Email: `admin@devlog.com`
- Password: `admin123` (or your choice)

**Test User 1:**

- Email: `user1@test.com`
- Password: `test123`
- LeetCode: `username1`
- Codeforces: `tourist`
- GitHub: `torvalds`

**Test User 2:**

- Email: `user2@test.com`
- Password: `test123`
- LeetCode: `username2`

## ✅ Verification Checklist

- [ ] MongoDB is running
- [ ] Backend started (port 5000)
- [ ] Frontend started (port 5173)
- [ ] `.env` file created with ADMIN_EMAIL
- [ ] Admin account registered
- [ ] Admin can login and see admin dashboard
- [ ] Test user can register and login
- [ ] Test user can link platforms
- [ ] Admin can sync data
- [ ] Test user can see synced stats

## 🎓 Next Steps

1. Read [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) for detailed documentation
2. Read [README.md](./README.md) for full project overview
3. Explore the Admin Dashboard features
4. Create multiple test users
5. Test different platform integrations
6. Customize the styling
7. Deploy to production!

## 🆘 Need Help?

- Check [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) for detailed admin documentation
- Check [README.md](./README.md) for full documentation
- Check terminal logs for errors
- Check browser console (F12) for frontend errors
- Ensure all environment variables are set correctly

## 🎉 Success!

If you can:

1. ✅ Login as admin
2. ✅ See the admin dashboard
3. ✅ Create test users
4. ✅ Sync platform data
5. ✅ See updated stats

**You're all set!** The application is working correctly.
