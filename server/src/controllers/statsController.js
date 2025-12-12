const PlatformStat = require("../models/PlatformStat");

exports.getAggregatedStats = async (req, res) => {
  try {
    const stats = await PlatformStat.find({ user: req.user.id });
    // Simple aggregation example: return platform -> data
    const result = {};
    stats.forEach((s) => {
      result[s.platform] = s.data || {};
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
