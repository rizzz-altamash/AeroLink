// models/PaymentHistory.js
import mongoose from 'mongoose';

const PaymentHistorySchema = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  deliveryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery',
    required: true
  },
  orderId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  razorpayPaymentId: String,
  razorpayOrderId: String,
  paymentMethod: {
    type: String,
    last4: String,
    upiId: String
  },
  priceBreakdown: {
    basePrice: Number,
    urgencyCharge: Number,
    distanceCharge: Number,
    weightCharge: Number,
    temperatureCharge: Number, 
    fragileCharge: Number,
    timeBasedCharge: Number,
    totalPrice: Number
  },
  staffDetails: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String
  },
  deliveryDetails: {
    packageType: String,
    urgency: String,
    weight: Number,
    deliveredAt: Date
  },
  receiptUrl: String,
  invoiceNumber: String,
  notes: String,
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

PaymentHistorySchema.index({ hospitalId: 1, createdAt: -1 });
PaymentHistorySchema.index({ deliveryId: 1 });
PaymentHistorySchema.index({ status: 1 });

export default mongoose.models.PaymentHistory || mongoose.model('PaymentHistory', PaymentHistorySchema);