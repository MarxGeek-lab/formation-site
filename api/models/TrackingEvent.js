const mongoose = require('mongoose');

const trackingEventSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['view', 'add_to_cart', 'purchase'],
    required: true,
    index: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: function() {
      return this.type === 'view' || this.type === 'add_to_cart';
    },
    index: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: function() {
      return this.type === 'purchase';
    },
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  metadata: {
    ip: {
      type: String,
      default: null
    },
    userAgent: {
      type: String,
      default: null
    },
    referer: {
      type: String,
      default: null
    },
    country: {
      type: String,
      default: null
    },
    city: {
      type: String,
      default: null
    },
    device: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet', 'unknown'],
      default: 'unknown'
    },
    browser: {
      type: String,
      default: null
    }
  },
  value: {
    type: Number,
    default: 0 // Pour les événements purchase, stocker la valeur de la commande
  }
}, {
  timestamps: true
});

// Index composé pour les requêtes de performance
trackingEventSchema.index({ type: 1, createdAt: -1 });
trackingEventSchema.index({ productId: 1, type: 1, createdAt: -1 });
trackingEventSchema.index({ sessionId: 1, createdAt: -1 });
trackingEventSchema.index({ userId: 1, createdAt: -1 });

// Méthodes statiques pour les statistiques
trackingEventSchema.statics.getEventStats = function(startDate, endDate, filters = {}) {
  const matchQuery = {
    createdAt: { $gte: startDate, $lte: endDate },
    ...filters
  };

  return this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalValue: { $sum: '$value' }
      }
    }
  ]);
};

trackingEventSchema.statics.getTopProducts = function(startDate, endDate, eventType = 'view', limit = 10) {
  return this.aggregate([
    {
      $match: {
        type: eventType,
        createdAt: { $gte: startDate, $lte: endDate },
        productId: { $exists: true }
      }
    },
    {
      $group: {
        _id: '$productId',
        count: { $sum: 1 },
        totalValue: { $sum: '$value' }
      }
    },
    { $sort: { count: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    {
      $project: {
        productId: '$_id',
        count: 1,
        totalValue: 1,
        productName: { $arrayElemAt: ['$product.name', 0] },
        productPrice: { $arrayElemAt: ['$product.price', 0] }
      }
    }
  ]);
};

trackingEventSchema.statics.getConversionFunnel = function(startDate, endDate, filters = {}) {
  const matchQuery = {
    createdAt: { $gte: startDate, $lte: endDate },
    ...filters
  };

  return this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        views: {
          $sum: { $cond: [{ $eq: ['$type', 'view'] }, 1, 0] }
        },
        addToCarts: {
          $sum: { $cond: [{ $eq: ['$type', 'add_to_cart'] }, 1, 0] }
        },
        purchases: {
          $sum: { $cond: [{ $eq: ['$type', 'purchase'] }, 1, 0] }
        },
        totalRevenue: {
          $sum: { $cond: [{ $eq: ['$type', 'purchase'] }, '$value', 0] }
        }
      }
    },
    {
      $project: {
        _id: 0,
        views: 1,
        addToCarts: 1,
        purchases: 1,
        totalRevenue: 1,
        cartConversionRate: {
          $cond: [
            { $gt: ['$views', 0] },
            { $multiply: [{ $divide: ['$addToCarts', '$views'] }, 100] },
            0
          ]
        },
        purchaseConversionRate: {
          $cond: [
            { $gt: ['$views', 0] },
            { $multiply: [{ $divide: ['$purchases', '$views'] }, 100] },
            0
          ]
        },
        checkoutConversionRate: {
          $cond: [
            { $gt: ['$addToCarts', 0] },
            { $multiply: [{ $divide: ['$purchases', '$addToCarts'] }, 100] },
            0
          ]
        }
      }
    }
  ]);
};

// Méthode pour associer les événements d'une session à un utilisateur
trackingEventSchema.statics.associateSessionToUser = function(sessionId, userId) {
  return this.updateMany(
    { sessionId, userId: null },
    { $set: { userId } }
  );
};

module.exports = mongoose.model('TrackingEvent', trackingEventSchema);
