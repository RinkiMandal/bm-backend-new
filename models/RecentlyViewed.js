// models/RecentlyViewed.js

const mongoose = require('mongoose');

const recentlyViewedSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  viewedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('RecentlyViewed', recentlyViewedSchema);
