// models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  email: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  addedAt: { type: Date, default: Date.now },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
