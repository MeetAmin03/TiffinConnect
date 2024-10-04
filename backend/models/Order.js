const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  menuItemIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['active', 'completed', 'canceled'], default: 'active' },
  orderDate: { type: Date, default: Date.now },
  subscriptionType: { type: String },
  paymentStatus: { type: String, enum: ['paid', 'pending', 'failed'], default: 'paid' }
});

module.exports = mongoose.model('Order', orderSchema);
