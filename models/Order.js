const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    orderItems: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            name: String,
            quantity: Number,
            price: Number,
            seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }
    ],

    shippingAddress: Object,
    totalPrice: Number,

    isPaid: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);