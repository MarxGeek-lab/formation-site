const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');

const subscriptionController = {
  // Créer un abonnement
  async createSubscription(req, res) {
    try {
      const { userId, planId } = req.body;
      
      const subscription = new Subscription({
        user: userId,
        plan: planId,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });

      await subscription.save();
      res.status(201).json(subscription);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Obtenir les abonnements actifs
  async getActiveSubscriptions(req, res) {
    try {
      const subscriptions = await Subscription.find({ status: 'ACTIVE' })
        .populate('user', 'firstName lastName email')
        .populate('plan');
      res.json(subscriptions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Annuler un abonnement
  async cancelSubscription(req, res) {
    try {
      const subscription = await Subscription.findById(req.params.id);
      subscription.status = 'CANCELLED';
      subscription.cancelledAt = new Date();
      await subscription.save();
      res.json(subscription);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Ajouter un paiement
  async addPayment(req, res) {
    try {
      const { subscriptionId, paymentData } = req.body;
      const subscription = await Subscription.findById(subscriptionId);
      
      subscription.paymentHistory.push(paymentData);
      if (paymentData.status === 'SUCCESS') {
        subscription.status = 'ACTIVE';
        subscription.nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }

      await subscription.save();
      res.json(subscription);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Obtenir les statistiques des abonnements
  async getSubscriptionStats(req, res) {
    try {
      const stats = await Subscription.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalRevenue: {
              $sum: {
                $reduce: {
                  input: '$paymentHistory',
                  initialValue: 0,
                  in: {
                    $add: [
                      '$$value',
                      { $cond: [{ $eq: ['$$this.status', 'SUCCESS'] }, '$$this.amount', 0] }
                    ]
                  }
                }
              }
            }
          }
        }
      ]);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = subscriptionController; 