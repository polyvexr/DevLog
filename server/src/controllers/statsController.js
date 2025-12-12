import PlatformStat from "../models/PlatformStat.js";

export const getAllStats = async (req, res) => {
  const stats = await PlatformStat.find({ userId: req.user._id });
  res.json({ success: true, stats });
};
