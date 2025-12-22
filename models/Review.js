const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    userName: String
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);