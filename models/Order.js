import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // link to user
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    }
  ],
  billingDetails: {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    address: { type: String, required: true },
  },
  paymentMethod: { type: String, enum: ["card", "upi", "cod"], required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
