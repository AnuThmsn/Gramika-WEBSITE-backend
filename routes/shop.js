const express = require('express');
const { protect, seller } = require('../middleware/auth');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

const router = express.Router();

router.post('/register-seller', protect, async (req, res) => {
    const user = await User.findById(req.user._id);

    user.isSeller = true;
    user.shopName = req.body.shopName;
    user.shopCategory = req.body.shopCategory;
    user.businessAddress = req.body.businessAddress;

    await user.save();
    res.json(user);
});

router.post('/products', protect, seller, async (req, res) => {
    const product = await Product.create({
        seller: req.user._id,
        ...req.body
    });
    res.status(201).json(product);
});

router.get('/orders', protect, seller, async (req, res) => {
    const orders = await Order.find({
        'orderItems.seller': req.user._id
    }).populate('user', 'name email');

    res.json(orders);
});

module.exports = router;