const express = require("express");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, (req, res) => {
  res.json({ message: "Shop route working" });
});

module.exports = router;
