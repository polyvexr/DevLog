import winston from "winston";

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  let metaStr = Object.keys(meta).length ? JSON.stringify(meta) : "";
  return `${timestamp} [${level}]: ${message} ${metaStr}`;
});

// Development format with colors
const devFormat = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  logFormat
);

// Production format (JSON for log aggregation)
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  winston.format.json()
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: process.env.NODE_ENV === "production" ? prodFormat : devFormat,
  transports: [
    new winston.transports.Console(),
  ],
  // Don't exit on uncaught exceptions
  exitOnError: false,
});

// Add file transport in production
// File logging removed for serverless deployment compatibility (read-only filesystem)
if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
  // Only add file logging if NOT on Vercel (or add a check for a writable dir if needed)
  // For Vercel, Console transport is sufficient as logs are captured by the platform.
}

export default logger;
