/**
 * Validation Middleware for DevLog API
 */

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate registration input
 */
export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  const errors = [];

  if (!name || !name.trim()) {
    errors.push("Name is required");
  }

  if (!email) {
    errors.push("Email is required");
  } else if (!emailRegex.test(email)) {
    errors.push("Invalid email format");
  }

  if (!password) {
    errors.push("Password is required");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

/**
 * Validate login input
 */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  next();
};

/**
 * Validate platform link input
 */
export const validatePlatformLink = (req, res, next) => {
  const { platform, username } = req.body;

  const validPlatforms = ["leetcode", "codeforces", "github"];

  if (!platform || !validPlatforms.includes(platform.toLowerCase())) {
    return res.status(400).json({ 
      message: `Platform must be one of: ${validPlatforms.join(", ")}` 
    });
  }

  if (!username || !username.trim()) {
    return res.status(400).json({ message: "Username is required" });
  }

  // Normalize platform to lowercase
  req.body.platform = platform.toLowerCase();
  req.body.username = username.trim();

  next();
};

/**
 * Sanitize user object for response (remove sensitive fields)
 */
export const sanitizeUser = (user) => {
  if (!user) return null;
  
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.__v;
  return obj;
};
