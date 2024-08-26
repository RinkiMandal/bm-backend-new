const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  email: {
    type:String,
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Wishlist', WishlistSchema);
