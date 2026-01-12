import { insightService } from "../services/insightService.js";

/**
 * Insight Controller - User insights endpoints
 */

/**
 * GET /api/insights
 * Get insights for the current user
 */
export const getUserInsights = async (req, res) => {
  try {
    const { limit = 20, includeRead = false } = req.query;

    const insights = await insightService.getUserInsights(req.user._id, {
      limit: parseInt(limit),
      includeRead: includeRead === "true"
    });

    res.json({ success: true, insights });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * PATCH /api/insights/:id/read
 * Mark an insight as read
 */
export const markInsightAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const insight = await insightService.markAsRead(id, req.user._id);
    if (!insight) {
      return res.status(404).json({ error: "Insight not found" });
    }

    res.json({ success: true, insight });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * PATCH /api/insights/:id/dismiss
 * Dismiss an insight
 */
export const dismissInsight = async (req, res) => {
  try {
    const { id } = req.params;

    const insight = await insightService.dismissInsight(id, req.user._id);
    if (!insight) {
      return res.status(404).json({ error: "Insight not found" });
    }

    res.json({ success: true, insight });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
