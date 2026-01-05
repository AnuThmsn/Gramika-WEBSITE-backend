const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { getProfile, updateCart } = require("../controllers/userController");

router.get("/profile", protect, getProfile);
router.post("/cart", protect, updateCart);

module.exports = router;
