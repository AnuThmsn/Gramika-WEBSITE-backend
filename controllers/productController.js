const Product = require("../models/Product");

exports.addProduct = async (req, res) => {
  const { name, price, quantity, image } = req.body;

  if (!name || !price || !quantity || !image) {
    return res.status(400).json({ message: "All fields required" });
  }

  const product = await Product.create({
    name,
    price,
    quantity,
    image,
    seller: req.user._id,
  });

  res.status(201).json(product);
};

exports.getProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
};
