const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getUserPlatforms,
  updatePlatform,
} = require("../controllers/platformController");

router.get("/", auth, getUserPlatforms);
router.post("/", auth, updatePlatform);

module.exports = router;
