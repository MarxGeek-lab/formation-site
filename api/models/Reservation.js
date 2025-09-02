const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
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
        enum: ['initial', 'remaining', 'refundCancelation', 'RefundCancelation'],
        required: true
      }
    }],
    remainingAmount: {
      type: Number,
      default: 0
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    duration: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'confirmed', 'cancelled', 'progress'],
      default: 'pending',
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    notifications: {
      type: Object,
      default: {
        endReminder: false
      }
    },
    quantity: {
      type: Number,
      default: 1,
    },
    amountCancelled: {
      type: Number,
      default: 0,
    },
    cancellationFee: {
      type: Number,
      min: 0,
    },
    commission: {
      type: Number,
      default: 0,
    },
    ticketName: {
      type: String,
    },
    optionPay: {
      type: String,
      enum: ['full', 'partial'],
      default: 'full'
    },
    type: {
      type: String,
      default: 'reservation'
    },
    durationType: {
      type: String,
      default: 'hour'
    },
    note: {
      type: String
    },
    answers: [
      {
        message: String,
        type: { type: String, enum: ['reply', 'question'], default: 'reply'},
        date: Date
      }
    ],
    notifications: {
      endReminder: {
        type: Boolean,
        default: false
      },
      warningReminder: {
        type: Boolean,
        default: false
      }
    },
    propertyState: {
      type: String,
      enum: ['confirm', 'reject', 'dispute_resolved', 'none'],
      default: 'none'
    },
    filesAttachPropertyState: {
      type: [String],
      default: []
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    rejectionReasonByAdmin: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Admin' 
    },
    isDispute: {
      type: Boolean,
      default: false
    },
    cancelledInfos: {
      cancelledAt: Date,
      cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      cancelledByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
      cancellationReason: String,
      cancelledByType: { type: String, enum: ['owner', 'tenant', 'admin'], default: 'tenant' },
    },
    disputeResolution: {
      resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
      decision: { type: String, enum: ['owner', 'tenant'] },
      appliedCancellationFee: { type: Boolean, default: false },
      appliedPlatformFee: { type: Boolean, default: false },
      comment: String,
      resolvedAt: Date
    },
    unlockFunds: {
      type: Boolean,
      default: false
    },
    unlockFundsBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    agreeTerms: { type: Boolean, default: false },
    userInfo: { type: String },
    cancelledAt: { type: Date },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

reservationSchema.pre('save', function (next) {
  if (!this.isModified('updatedAt')) {
    this.updatedAt = Date.now();
  }
  next();
});

reservationSchema.pre('validate', function (next) {
  // Créer des objets Date combinant date et heure
  const startDateTime = new Date(this.startDate);
  const endDateTime = new Date(this.endDate);
  
  if (this.startTime) {
    const [startHours, startMinutes] = this.startTime.split(':');
    startDateTime.setHours(parseInt(startHours), parseInt(startMinutes));
  }
  
  if (this.endTime) {
    const [endHours, endMinutes] = this.endTime.split(':');
    endDateTime.setHours(parseInt(endHours), parseInt(endMinutes));
  }

  if (startDateTime >= endDateTime) {
    return next(new Error('La date et l\'heure de début doivent être antérieures à la date et l\'heure de fin.'));
  }
  next();
});

module.exports = mongoose.model('Reservation', reservationSchema);
