import PlatformStat from "../models/PlatformStat.js";

export const linkPlatform = async (req, res) => {
  const { platform, username } = req.body;

  const existing = await PlatformStat.findOne({
    userId: req.user._id,
    platform,
  });

  if (existing)
    return res.status(400).json({ message: "Platform already linked" });

  const entry = await PlatformStat.create({
    userId: req.user._id,
    platform,
    username,
    stats: {},
    lastUpdated: null,
  });

  res.json({ success: true, entry });
};

export const getPlatforms = async (req, res) => {
  const data = await PlatformStat.find({ userId: req.user._id });
  res.json(data);
};
