const PlatformStat = require("../models/PlatformStat");

exports.getUserPlatforms = async (req, res) => {
  try {
    const stats = await PlatformStat.find({ user: req.user.id });
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.updatePlatform = async (req, res) => {
  try {
    const { platform, data } = req.body;
    if (!platform) return res.status(400).json({ msg: "Platform required" });
    const stat = await PlatformStat.findOneAndUpdate(
      { user: req.user.id, platform },
      { data, lastUpdated: new Date() },
      { upsert: true, new: true }
    );
    res.json(stat);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
