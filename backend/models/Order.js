const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    // Cart uses Fake Store ids (e.g. "1","2"), so keep productId as a string.
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, default: 'placed' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

