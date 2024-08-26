const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  serialNumber: { type: Number, required: true },
  productName: { type: String, required: true },
  brandName: { type: String, required: true },
  size: { type: String, required: true },
  description: { type: String, required: true },
  colour: { type: String, required: true },
  category: { type: String, required: true },
  mrp: { type: String, required: true },
  discountedPrice: { type: Number, required: true },
  offer: { type: String },
  images: [{ type: String, required: true }],
  rating: { type: Number, min: 0, max: 5 }, 
  review: { type: String },
  quantity: { type: String }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
