const mongoose = require('mongoose');

const DeliveredOrderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  checkoutDate: {
    type: Date,
    default: Date.now,
  },
  deliveryDate: {
    type: Date,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  cartItems: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  }],
  shippingAddress: {
    firstName: String,
    lastName: String,
    gender: String,
    mobileNumber: String,
    addressLine1: String,
    addressLine2: String,
    pincode: String,
    city: String
},
  orderStatus: {
    type: String,
    enum: ['pending', 'shipped', 'out for delivery', 'order delivered'],
    default: 'order delivered',
  },
}, {
  timestamps: true,
});



module.exports = mongoose.model('DeliveredOrder', DeliveredOrderSchema);
