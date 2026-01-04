const express = require("express");
const protect = require("../src/middleware/authMiddleware");

const router = express.Router();

/* TEST ROUTE */
router.post("/create", protect, (req, res) => {
  res.json({ message: "Shop route working" });
});

module.exports = router;
