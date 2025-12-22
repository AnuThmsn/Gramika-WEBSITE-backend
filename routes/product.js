const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

/**
 * @route   POST /api/products/add
 * @desc    Add new product
 */
router.post("/add", async (req, res) => {
  try {
    const { name, price, quantity, image } = req.body;

    if (!name || !price || !quantity || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = new Product({
      name,
      price,
      quantity,
      image
    });

    await product.save();

    res.status(201).json({
      message: "Product added successfully",
      product
    });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/products
 * @desc    Get all products
 */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;