const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { name, price, quantity, image } = req.body;

    if (!name || !price || !quantity || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await Product.create({
      name,
      price,
      quantity,
      image,
    });

    res.status(201).json({ message: "Product added", product });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

module.exports = router;
