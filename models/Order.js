const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    cartItems: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
        }
    ],
    paymentMethod: {
        type: String,
        required: true
    },
    checkoutDate: {
        type: Date,
        default: Date.now
    },
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
        default: 'pending'
    },
    UserState:{
        type: String,
        default: 'Order Active'
    }
});

module.exports = mongoose.model('Order', orderSchema);
