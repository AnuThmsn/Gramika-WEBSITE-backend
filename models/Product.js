const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Vegetables",
        "Fruits",
        "Poultry & Meat",
        "Dairy & Beverages",
        "Bakery & Snacks",
        "Homemade Essentials"
      ]
    },
    image: {
      type: String, // Base64 image
      required: true
    },
    status: {
      type: String,
      default: "available"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
