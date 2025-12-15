import dotenv from "dotenv";
dotenv.config();

export const adminAuth = (req, res, next) => {
  try {
    // Check if user is authenticated first
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check if user email matches admin email from env
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      return res.status(500).json({
        success: false,
        message: "Admin configuration missing",
      });
    }

    if (req.user.email !== adminEmail) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
