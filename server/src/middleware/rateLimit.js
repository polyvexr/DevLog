import rateLimit from "express-rate-limit";

/**
 * General API Rate Limiter
 * Limits all requests to 100 per 15 minutes
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 100 : 1000, // 100 in production, 1000 for dev/testing
  message: {
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Authentication Rate Limiter
 * More strict: Limits login/register/password reset attempts
 */
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 attempts per hour
  message: {
    message: "Too many authentication attempts, please try again after an hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

