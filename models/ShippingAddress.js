const mongoose = require('mongoose');

const shippingAddressSchema = new mongoose.Schema({
    UserEmail: String,
    firstName: String,
    lastName: String,
    gender: String,
    mobileNumber: String,
    email: String,
    addressLine1: String,
    addressLine2: String,
    pincode: String,
    city: String,
  });

module.exports = mongoose.model('ShippingAddress', shippingAddressSchema);