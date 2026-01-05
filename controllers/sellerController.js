const Product = require("../models/Product");

// ✅ Add new product
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      image: req.body.image,
      seller: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Product creation failed" });
  }
};

// ✅ Get products of logged-in seller
exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};
