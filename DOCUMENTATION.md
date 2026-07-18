# Technical Documentation and Development Guide

This document serves as the comprehensive development guide, technical reference, and system architecture manual for developers working on the DevLog project.

***

## Table of Contents

* [Architecture Overview](#architecture-overview)
* [Development Environment Setup](#development-environment-setup)
* [Available Scripts](#available-scripts)
* [Project Structure](#project-structure)
* [Frontend Development](#frontend-development)
  * [Routing](#routing)
  * [Context Providers](#context-providers)
  * [API Layer](#api-layer)
  * [Pages](#pages)
  * [Components](#components)
  * [Styling](#styling)
* [Backend Development](#backend-development)
  * [Express App](#express-app)
  * [Database Models](#database-models)
  * [API Routes](#api-routes)
  * [Authentication Middleware](#authentication-middleware)
* [Developer Workflow and Conventions](#developer-workflow-and-conventions)
  * [Branching Strategy](#branching-strategy)
  * [Commit Messages](#commit-messages)
  * [Code Style](#code-style)
* [Step-by-Step Development Instructions](#step-by-step-development-instructions)
  * [Adding a New Platform Integration](#adding-a-new-platform-integration)
  * [Adding a New API Endpoint](#adding-a-new-api-endpoint)
  * [Testing Your Changes](#testing-your-changes)
* [Deployment](#deployment)
* [Environment Variables](#environment-variables)
* [Data Flow Diagrams](#data-flow-diagrams)
* [Error Handling](#error-handling)
* [Security](#security)

***

## Architecture Overview

The project is structured as a monorepo containing both the frontend and backend applications:

* client: React, Vite SPA, Tailwind CSS
* server: Express API, MongoDB Mongoose ODM, JWT Auth, Cron sync jobs

Key Design Decisions:
* **Separated Client and Server**: The frontend runs as a Vite-powered single-page application on the client-side, while the backend runs as an Express API server on the server-side.
* **Platform Sync System**: The backend fetches and scrapes data from programming platforms (LeetCode, Codeforces, GitHub, AtCoder, CodeChef) using scheduled cron jobs and caches them in the database to prevent rate limiting.
* **Public Profile System**: Users can toggle public visibility for their profile, allowing anyone to view their compiled statistics via a public page.

***

## Development Environment Setup

### Prerequisites
* Node.js version 20 or higher
* MongoDB (local database or a remote MongoDB Atlas database instance)
* Git
* npm (Node Package Manager)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shankar-CSE/DevLog.git
   cd DevLog
   ```

2. **Install dependencies**
   Install dependencies in both the client and server directories:
   ```bash
   cd client && npm install
   cd ../server && npm install
   cd ..
   ```

3. **Set up environment variables**
   Create a .env file inside the server directory with the following variables:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:5173
   RESEND_API_KEY=your_resend_email_key
   RESEND_FROM_EMAIL=your_sending_email
   CRON_SECRET=your_cron_secret_key
   CLIST_API_KEY=your_clist_username_and_api_key
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   TELEGRAM_CHAT_ID=your_telegram_chat_id
   ```

   Create a .env file inside the client directory:
   ```env
   VITE_BACKEND_URL=http://localhost:5000/api
   ```

4. **Start the application**
   Run the backend development server first:
   ```bash
   cd server && npm run dev
   ```
   In a separate terminal, start the frontend development server:
   ```bash
   cd client && npm run dev
   ```

***

## Available Scripts

The following scripts can be executed from the respective directory:

### Client Scripts (Run from client directory)

| Script | Command | Description |
| - | - | - |
| dev | vite | Start Vite development server |
| build | vite build | Build the production client bundle |
| lint | eslint . | Run ESLint static analysis |
| preview | vite preview | Preview the production build locally |

### Server Scripts (Run from server directory)

| Script | Command | Description |
| - | - | - |
| dev | node watch server.js | Start the backend development server with hot reloading |
| start | node server.js | Start the backend production server |

***

## Project Structure

* DevLog/
  * client/
    * index.html
    * package.json
    * vite.config.js
    * src/
      * App.jsx
      * main.jsx
      * index.css
      * api/
        * axios.js
      * components/
        * Sidebar.jsx
        * Navbar.jsx
        * ContestCard.jsx
        * PlatformCard.jsx
        * PlatformDetails.jsx
        * AuthenticatedLayout.jsx
        * StatCard.jsx
        * SummarySection.jsx
        * Dialog.jsx
        * DisconnectDialog.jsx
        * ErrorBoundary.jsx
        * FilterButtons.jsx
        * FullPageLoader.jsx
        * Loader.jsx
      * context/
        * AuthContext.js
        * AuthProvider.jsx
        * SidebarContext.js
        * SidebarProvider.jsx
      * hooks/
      * pages/
        * Landing.jsx
        * Login.jsx
        * Dashboard.jsx
        * Contests.jsx
        * Settings.jsx
        * PublicProfile.jsx
        * NotFound.jsx
        * LeetCodeDetails.jsx
        * CodeforcesDetails.jsx
        * GitHubDetails.jsx
        * AtCoderDetails.jsx
        * CodeChefDetails.jsx
  * server/
    * server.js
    * package.json
    * vercel.json
    * src/
      * config/
        * db.js
      * middleware/
        * authMiddleware.js
      * models/
        * User.js
        * PlatformStat.js
        * PlatformAction.js
        * Contest.js
        * SyncJob.js
      * routes/
        * auth.js
        * platforms.js
        * stats.js
        * user.js
        * contests.js
        * public.js
        * cron.js
        * dashboard.js

***

## Frontend Development

### Routing

Client-side routes are defined in client/src/App.jsx:

* / -> Landing
* /login -> Login
* /dashboard -> Dashboard (Protected)
* /contests -> Contests (Protected)
* /settings -> Settings (Protected)
* /public/:username -> PublicProfile
* /platforms/:platform -> PlatformDetails (Protected)
* * -> NotFound

### Context Providers

#### AuthContext
Provides global state for user authentication.

* user: Contains active user details and authentication token.
* loading: Status of the authentication checks.
* login: Sends login request to backend and stores token in local storage.
* logout: Clears session and local storage.

#### SidebarContext
Manages the open/close state of the dashboard navigation drawer.

### API Layer

#### Axios Configuration (client/src/api/axios.js)
Sets the default configurations for API calls:
* Base URL is set to the configured VITE_BACKEND_URL.
* Interceptors automatically inject the Bearer token from local storage into all outgoing request headers.

***

## Backend Development

### Express App (server/server.js)
Sets up middleware configurations (Cors, Helmet, Compression, Rate limiting), mounts routes, and initiates database connection.

### Database Models

#### User Model (server/src/models/User.js)
Stores account profiles, credentials, and settings.

#### PlatformStat Model (server/src/models/PlatformStat.js)
Stores cached statistics for connected coding platforms.

#### Contest Model (server/src/models/Contest.js)
Stores scraped/fetched information on upcoming programming competitions.

### API Routes

* /api/auth: User login, register, and logout.
* /api/platforms: Connecting/disconnecting LeetCode, GitHub, Codeforces, AtCoder, CodeChef.
* /api/stats: Fetching cached platform statistics.
* /api/contests: Querying scheduled competition calendars.
* /api/cron: Executing scheduled background synchronization runs.

***

## Developer Workflow and Conventions

### Branching Strategy
Create branches from the main branch using the format: type/short-description (e.g. feature/atcoder-integration or fix/jwt-refresh).

### Commit Messages
Follow conventional commit specifications: type(scope): description (e.g. feat(client): add contests view or fix(api): improve rate limiter).

### Code Style
* Use two-space indentation.
* Use single quotes for Javascript strings.
* Implement functional components in React.
* Handle promises using async/await with try-catch blocks.

***

## Step-by-Step Development Instructions

### Adding a New Platform Integration

1. **Extend the Platform Model**: Update server/src/models/PlatformStat.js to accommodate the new platform metrics.
2. **Implement Fetch/Scrape Service**: Add helper files under server/src/services/ to fetch data from the target platform API or web page.
3. **Register Route Handlers**: Link the syncing actions to the main cron router in server/src/routes/cron.js.
4. **Create Frontend Views**: Create the details page under client/src/pages/ and register it inside client/src/App.jsx.

### Adding a New API Endpoint

1. **Define routes**: Add the endpoint route handler in server/src/routes/.
2. **Implement controllers**: Write the endpoint controller logic under server/src/controllers/.
3. **Update client axios**: Add corresponding API requests inside client/src/api/.

### Testing Your Changes
Before finalizing changes, verify:
* Both backend and frontend servers launch without compile-time errors.
* Network requests perform successfully without CORS issues.
* User actions persist correctly to the database.

***

## Deployment

Deployments are configured for Vercel using vercel.json. Frontend client code is compiled to static files, and backend routes map to serverless API functions.

***

## Environment Variables

* MONGO_URI: Connection string to MongoDB instance.
* JWT_SECRET: Security key for signing JWT tokens.
* VITE_BACKEND_URL: Target URL of the backend API server.
* CRON_SECRET: Protection key to authenticate cron actions.

***

## Data Flow Diagrams

### Registration Flow
```
User registers
  |
  v
POST /api/auth/register
  |
  v
User document created with hashed password
  |
  v
JWT token generated and returned
  |
  v
Token stored in browser local storage
```

### Stats Sync Flow
```
Cron job or manual trigger fired
  |
  v
GET /api/cron/all (checked against CRON_SECRET)
  |
  v
Scrapers fetch data from platform endpoints
  |
  v
Data processed and saved to PlatformStat collection
```

***

## Error Handling

Backend routers wrap endpoint logic in try-catch structures and pass errors to global middleware loggers. standard API endpoints return 400 for input issues, 401 for authentication failures, and 500 for internal server exceptions.

***

## Security

* Passwords are encrypted using bcryptjs before storage.
* JSON Web Tokens control route authorization.
* Helmet sets security-oriented HTTP response headers.
