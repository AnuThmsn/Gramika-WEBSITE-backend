const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Order = require('../models/Order');

const router = express.Router();

router.get('/profile', protect, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
});

router.put('/cart', protect, async (req, res) => {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user._id);

    const index = user.cart.findIndex(
        i => i.product.toString() === productId
    );

    if (index >= 0) user.cart[index].quantity = quantity;
    else user.cart.push({ product: productId, quantity });

    user.cart = user.cart.filter(i => i.quantity > 0);
    await user.save();

    await user.populate('cart.product');
    res.json(user.cart);
});

router.post('/orders', protect, async (req, res) => {
    const order = await Order.create({
        user: req.user._id,
        ...req.body
    });

    await User.findByIdAndUpdate(req.user._id, { cart: [] });
    res.status(201).json(order);
});

module.exports = router;