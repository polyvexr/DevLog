const mongoose = require("mongoose");

const PlatformStatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  platform: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PlatformStat", PlatformStatSchema);
