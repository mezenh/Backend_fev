const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }],
  total: { type: Number, required: true },
  deliveryAddress: { type: String, required: true },
  status: { type: String, enum: ['processing', 'shipped', 'delivered'], default: 'processing' }
}, 
{ timestamps: true });
