import express from "express";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js"; // optional, if user must be logged in

const router = express.Router();

// Create a new order
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, billingDetails, paymentMethod, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const newOrder = new Order({
      user: req.user._id, // from auth middleware
      items,
      billingDetails,
      paymentMethod,
      totalAmount,
      status: paymentMethod === "cod" ? "Pending" : "Completed"
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: savedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all orders of logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all orders (admin only)
// router.get("/all", adminMiddleware, async (req, res) => { ... });

export default router;
