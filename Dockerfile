FROM node:20-alpine

WORKDIR /app

# Install dependencies from server package
COPY server/package.json server/package-lock.json* ./
RUN npm ci --only=production || npm install --only=production

# Copy server source
COPY server/ ./

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["npm", "start"]
