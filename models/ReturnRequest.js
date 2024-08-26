const mongoose = require('mongoose');

const returnRequestSchema = new mongoose.Schema({
  email: { type: String, required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  reason: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  name: { type: String, required: true },
  expectedDeliveryDate: { type: Date},
  orderStatus: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReturnRequest', returnRequestSchema);
