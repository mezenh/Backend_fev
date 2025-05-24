const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, default: "" },
  images: { type: [String], default: [] },
  stock: { type: Number, default: 1, min: 0 },
  category: {
    type: String,
    enum: ['poterie', 'tapis', 'bijoux', 'cuir', 'autres'],
    default: 'autres'
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);