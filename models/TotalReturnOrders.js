const mongoose = require('mongoose');

const totalReturnOrdersSchema = new mongoose.Schema({
  orderId: String,
  reason: String,
  name: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  mobileNumber: String,
  orderStatus: String,
  expectedDeliveryDate: Date,
  cartItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: Number,
    },
  ],
  totalPrice: Number,
  returnDate: {
    type: Date,
    default: Date.now,
  },
});

const TotalReturnOrders = mongoose.model('TotalReturnOrders', totalReturnOrdersSchema);

module.exports = TotalReturnOrders;
