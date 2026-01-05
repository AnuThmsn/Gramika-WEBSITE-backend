const User = require("../models/User");

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
};

exports.updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const user = await User.findById(req.user._id);

    const index = user.cart.findIndex(
      (i) => i.product.toString() === productId
    );

    if (index >= 0) {
      user.cart[index].quantity = quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    user.cart = user.cart.filter((i) => i.quantity > 0);

    await user.save();

    res.json(user.cart);
  } catch (err) {
    console.error("Cart error:", err);
    res.status(500).json({ message: "Cart update failed" });
  }
};
