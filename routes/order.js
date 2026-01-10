const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth"); // ✅ FIX

/* ===============================
   CREATE ORDER (USER)
================================ */
router.post("/", auth, async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      user: req.user.userId, // ✅ matches your auth middleware
      items,
      shippingAddress,
      totalAmount,
      paymentMethod,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   GET ALL ORDERS
================================ */
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name address pincode mobile")
      .populate("items.product", "name price");

    res.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
