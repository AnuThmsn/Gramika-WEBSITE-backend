const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      paymentMethod,
      customerName,
      mobile,
      address,
      pincode,
    } = req.body;

    // ✅ strict validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // ✅ normalize items
    const formattedItems = items.map((item) => {
      const productId = item.product || item.productId || item._id;

      if (!productId) {
        throw new Error("Product ID missing");
      }

      return {
        product: productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        seller: item.seller,
      };
    });

    const order = await Order.create({
      user: req.user._id,

      items: formattedItems,

      shippingAddress: {
        name: customerName,
        mobile,
        address,
        pincode,
      },

      paymentMethod,
      totalAmount,
      status: "Pending",
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Order creation error:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
};
