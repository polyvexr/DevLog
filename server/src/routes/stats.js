const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getAggregatedStats } = require("../controllers/statsController");

router.get("/", auth, getAggregatedStats);

module.exports = router;
