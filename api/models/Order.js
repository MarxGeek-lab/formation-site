const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    shippingAddress: {
      fullName: String,
      address: String,
      city: String,
      district: String,
      postalCode: String,
      country: String,
      phoneNumber: String,
      email: String,
    },
    fullName: String,
    address: String,
    city: String,
    district: String,
    country: String,
    phoneNumber: String,
    email: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'unpaid', 'partiallyPaid', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      default: 'Monero'
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmountConvert: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
    },
    subTotal: {
      type: Number,
      default: 12000,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    payments: [{
      transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
      },
      amount: {
        type: Number,
        required: true
      },
      paymentDate: {
        type: Date,
        default: Date.now
      },
      type: {
        type: String,
        enum: ['payment', 'refund'],
        default: 'payment'
      }
    }],
    cancelInfos: {
      reason: String,
      cancelledAt: Date,
      cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      cancelledByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
      cancellationReason: String,
      cancelledByType: { type: String, enum: ['owner', 'user'], default: 'user' },
    },
    description: {
      type: String,
    },
    invoice: {
      type: String,
    },
    contrat:  {
      type: String,
    },
    productZip: {
      type: String,
    },
    affiliate: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Affiliate", 
      default: null 
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
