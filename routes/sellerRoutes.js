const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  createProduct,
  getSellerProducts,
} = require("../controllers/sellerController");

// ✅ Create product
router.post("/product", protect, createProduct);

// ✅ Get seller products
router.get("/products", protect, getSellerProducts);

module.exports = router;
