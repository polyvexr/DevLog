#!/usr/bin/env bash
set -euo pipefail

# Navigate to the server folder and start the app (used by Railpack/Railway)
cd "$(dirname "$0")/server"

echo "Installing dependencies..."
if [ -f package-lock.json ]; then
  npm ci --only=production || npm install --only=production
else
  npm install --only=production
fi

echo "Starting server..."
npm start
