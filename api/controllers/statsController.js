const { default: mongoose, Types } = require('mongoose');
const Rental = require('../models/Rental');
const Reservation = require('../models/Reservation');
const Sale = require('../models/Sale');
const Transaction = require('../models/Transaction');
const UserReward = require('../models/UserReward');
const Product = require('../models/Product');
const User = require('../models/User');
const Withdrawal = require('../models/Withdrawal');
const commonService = require('../services/commonService');
const Order = require('../models/Order');
const UserVisit = require('../models/UserVisit');

const statsController = {
  // Statistiques globales
  async getGlobalStats(req, res) {
    try {
      // Agréger les données des récompenses utilisateur pour obtenir le nombre total d'utilisateurs par niveau
      // et la somme totale des points pour chaque niveau
      const stats = await UserReward.aggregate([
        {
          $group: {
            _id: '$level', // Grouper par niveau de récompense
            count: { $sum: 1 }, // Compter le nombre d'utilisateurs dans chaque groupe
            totalPoints: { $sum: '$totalPoints' } // Calculer la somme des points totaux pour chaque groupe
          }
        }
      ]);
      // Envoyer les statistiques calculées en réponse
      res.json(stats);
    } catch (error) {
      // En cas d'erreur, envoyer un message d'erreur avec le statut 500
      res.status(500).json({ message: error.message });
    }
  },

  // Statistiques de parrainage
  async getReferralStats(req, res) {
    try {
      // Agréger les données des récompenses utilisateur pour obtenir le nombre total de parrainages
      // par statut (en attente ou complété)
      const stats = await UserReward.aggregate([
        { $unwind: '$referralCode.referrals' }, // Décomposer le tableau des parrainages pour chaque utilisateur
        {
          $group: {
            _id: '$referralCode.referrals.status', // Grouper par statut de parrainage
            count: { $sum: 1 } // Compter le nombre de parrainages dans chaque groupe
          }
        }
      ]);
      // Envoyer les statistiques de parrainage calculées en réponse
      res.json(stats);
    } catch (error) {
      // En cas d'erreur, envoyer un message d'erreur avec le statut 500
      res.status(500).json({ message: error.message });
    }
  },

  async getStatsByOwner(req, res) {
    try {
      const [
        ordersCount,
        ordersPending,
        ordersConfirmed,
        ordersShipped,
        ordersDelivered,
        ordersCancelled,
        usersCount,
        userVisitCount,
        productsCount,
      ] = await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ status: "pending" }),
        Order.countDocuments({ status: "confirmed" }),
        Order.countDocuments({ status: "shipped" }),
        Order.countDocuments({ status: "delivered" }),
        Order.countDocuments({ status: "cancelled" }),
        User.countDocuments(),
        UserVisit.countDocuments(),
        Product.countDocuments(),
      ]);

      const salesRevenue = await Order.find({ status: "completed" })
        .populate('payments.transaction');

      const totalSalesRevenue = salesRevenue.reduce((total, order) => {
        return total + order.payments.reduce((paymentTotal, payment) => {
          return payment.transaction.status === "success" && payment.transaction.type === "payment" ? paymentTotal + payment.transaction.amount : paymentTotal;
        }, 0);
      }, 0);
  
      return res.status(200).json({
        countOrders: ordersCount,
        countOrdersPending: ordersPending,
        countOrdersConfirmed: ordersConfirmed,
        countOrdersShipped: ordersShipped,
        countOrdersDelivered: ordersDelivered,
        countOrdersCancelled: ordersCancelled,
        salesRevenue: totalSalesRevenue,
        usersCount: usersCount,
        userVisitCount: userVisitCount,
        productsCount: productsCount,
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },
  

  async getStatsByDirectSeller(req, res) {
    try {
      const seller = await User.findOne({ _id: req.params.id, });

      if (!seller) return 
      const rentalStats = Rental.countDocuments({ owner: req.params.id });
      const rentalPending = Rental.countDocuments({ owner: req.params.id, status: "pending" });
      const rentalProgress = Rental.countDocuments({ owner: req.params.id, status: "progress" });
      const rentalComplete = Rental.countDocuments({ owner: req.params.id, status: "completed" });
      const rentalCancelled = Rental.countDocuments({ owner: req.params.id, status: "cancelled" });

      const propertySytats = Product.countDocuments({ owner: req.params.id });
      const propertyPending = Product.countDocuments({ owner: req.params.id, statusValidate: "pending" });
      const propertyConfirmed = Product.countDocuments({ owner: req.params.id, statusValidate: "approved" });
      const propertyCancelled = Product.countDocuments({ owner: req.params.id, statusValidate: "rejected" });
  
      const revenue = await Transaction.aggregate([
        { $match: { seller: new mongoose.Types.ObjectId(req.params.id), status: 'completed' } }, 
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
  
      // Exécuter toutes les requêtes en parallèle
      const rent = await Promise.all([
        rentalStats, rentalPending, rentalProgress, rentalComplete, rentalCancelled,
        revenue
      ]);

      const property = await Promise.all([
        propertySytats, propertyPending, propertyConfirmed, propertyCancelled,
      ]);
  
      // Construire la réponse JSON
      const stats = {
        rent: {
          count: rent[0],
          countPending: rent[1],
          countProgress: rent[2],
          countComplete: rent[3],
          countCancelled: rent[4],
        },
        property: {
          count: property[0],
          countPending: property[1],
          countAproved: property[2],
          countRejected: property[3],
        },
        earn: {
          revenue: Math.round(rent[5][0]?.total || 0), // Si aucune transaction, renvoyer 0
        }
      };
  
      // Envoyer la réponse JSON
      res.status(200).json(stats);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  async getStatsByTenant(req, res) {
    console.log("==== ", req.params.id)
    try {
      const seller = await User.findOne({ _id: req.params.id, });

      if (!seller) return 
      const rentalStats = Rental.countDocuments({ tenant: req.params.id });
      const rentalPending = Rental.countDocuments({ tenant: req.params.id, status: "pending" });
      const rentalProgress = Rental.countDocuments({ tenant: req.params.id, status: "progress" });
      const rentalComplete = Rental.countDocuments({ tenant: req.params.id, status: "completed" });
      const rentalCancelled = Rental.countDocuments({ tenant: req.params.id, status: "cancelled" });

      const reservationStats = Reservation.countDocuments({ tenant: req.params.id });
      const reservationPending = Reservation.countDocuments({ tenant: req.params.id, status: "pending" });
      const reservationProgress = Reservation.countDocuments({ tenant: req.params.id, status: "progress" });
      const reservationCompleted = Reservation.countDocuments({ tenant: req.params.id, status: "completed" });
      const reservationCancelled = Reservation.countDocuments({ tenant: req.params.id, status: "cancelled" });
      const reservationConfirmed = Reservation.countDocuments({ tenant: req.params.id, status: "confirmed" });
  
      const saleStats = Sale.countDocuments({ buyer: req.params.id });
      const salePending = Sale.countDocuments({ buyer: req.params.id, status: "pending" });
      const saleProgress = Sale.countDocuments({ buyer: req.params.id, status: "progress" });
      const saleComplete = Sale.countDocuments({ buyer: req.params.id, status: "completed" });
      const saleCancelled = Sale.countDocuments({ buyer: req.params.id, status: "cancelled" });
  
      const revenue = await Transaction.aggregate([
        { $match: { seller: new mongoose.Types.ObjectId(req.params.id), status: 'completed' } }, 
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
  
      // Exécuter toutes les requêtes en parallèle
      const rent = await Promise.all([
        rentalStats, rentalPending, rentalProgress, rentalComplete, rentalCancelled,
        revenue
      ]);

      const sale = await Promise.all([
        saleStats, salePending, saleProgress, saleComplete, saleCancelled,
      ]);

      const reservation = await Promise.all([
        reservationStats, reservationPending, reservationProgress, reservationCompleted, reservationCancelled, reservationConfirmed,
      ]);
  
      // Construire la réponse JSON
      const stats = {
        rent: {
          count: rent[0],
          countPending: rent[1],
          countProgress: rent[2],
          countComplete: rent[3],
          countCancelled: rent[4],
        },
        sale: {
          count: sale[0],
          countPending: sale[1],
          countProgress: sale[2],
          countComplete: sale[3],
          countCancelled: sale[4],
        },
        reservation: {
          count: reservation[0],
          countPending: reservation[1],
          countProgress: reservation[2],
          countCompleted: reservation[3],
          countCancelled: reservation[4],
          countConfirmed: reservation[5],
        },
        earn: {
          revenue: Math.round(rent[5][0]?.total || 0), // Si aucune transaction, renvoyer 0
        }
      };
  
      // Envoyer la réponse JSON
      res.status(200).json(stats);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  /***
   * Stats admin
   */
  async getStatsByAdmin(req, res) {
    try {
      const rentalStats = Rental.countDocuments();
      const rentalPending = Rental.countDocuments({ status: "pending" });
      const rentalProgress = Rental.countDocuments({ status: "progress" });
      const rentalComplete = Rental.countDocuments({ status: "completed" });
      const rentalCancelled = Rental.countDocuments({ status: "cancelled" });
  
      const saleStats = Sale.countDocuments();
      const salePending = Sale.countDocuments({ status: "pending" });
      const saleProgress = Sale.countDocuments({ status: "progress" });
      const saleComplete = Sale.countDocuments({ status: "completed" });
      const saleCancelled = Sale.countDocuments({ status: "cancelled" });
  
      const reservationStats = Reservation.countDocuments();
      const reservationPending = Reservation.countDocuments({ status: "pending" });
      const reservationProgress = Reservation.countDocuments({ status: "progress" });
      const reservationCompleted = Reservation.countDocuments({ status: "completed" });
      const reservationCancelled = Reservation.countDocuments({ status: "cancelled" });
      const reservationConfirmed = Reservation.countDocuments({ status: "confirmed" });

      const propertySytats = Product.countDocuments();
      const propertyPending = Product.countDocuments({ statusValidate: "pending" });
      const propertyApproved = Product.countDocuments({ statusValidate: "approved" });
      const propertyCancelled = Product.countDocuments({ statusValidate: "rejected" });
      const propertyAvailable = Product.countDocuments({ state: "available" });
      const propertyReserved = Product.countDocuments({ state: "reserved" });

      const userStats = User.countDocuments();
      const userAgent = User.countDocuments({ role: 'agent' });
      const userOwner = User.countDocuments({ role: 'owner' });
      const userSimple = User.countDocuments({ role: 'user' });

      const withdrawComplete = Withdrawal.countDocuments({ status: 'paid' });
      const withdrawPending = Withdrawal.countDocuments({ status: 'pending' });
      const withdrawCancelled = Withdrawal.countDocuments({ status: 'rejected' });
      const withdrawApproved = Withdrawal.countDocuments({ status: 'approved' });
      const withdrawStats = Withdrawal.countDocuments();

      const totalRevenue = await Transaction.find({
          type: { $in: ['Payment', 'RefundCancelation', 'refundCancelation' ]},
          status: 'success',
          balanceImpact: 'credit'
      }); 

      // Calculer la somme des montants de toutes les transactions
      const balanceTotalCredit = totalRevenue.reduce((total, transaction) => {
        return total + Number(transaction.amount);
      }, 0);

      const withdrawalAmount = await Withdrawal.aggregate([
        { $match: { status: 'paid' } }, 
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);

      const withdrawalAmountInPending = await Withdrawal.aggregate([
        { $match: { status: 'pending' } }, 
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);

      const commissionReservation = await Reservation.aggregate([
        { $match: { status: { $in: ['completed', 'confirmed', 'progress'] } } }, 
        { $group: { _id: null, total: { $sum: "$commission" } } }
      ]);
  
      // Exécuter toutes les requêtes en parallèle
      const revenues = await Promise.all([ 
        withdrawalAmount, withdrawalAmountInPending, commissionReservation
      ]);

      const rent = await Promise.all([
        rentalStats, rentalPending, rentalProgress, rentalComplete, rentalCancelled,
      ]);

      const users = await Promise.all([
        userStats, userAgent, userOwner, userSimple
      ]);

        const property = await Promise.all([
        propertySytats, propertyPending, propertyApproved, propertyCancelled, propertyAvailable, propertyReserved
      ]);

      const sale = await Promise.all([
        saleStats, salePending, saleProgress, saleComplete, saleCancelled,
      ]);

      const reservation = await Promise.all([
        reservationStats, reservationPending, reservationCompleted, reservationProgress, reservationCancelled, reservationConfirmed,
      ]);

      const withdraw = await Promise.all([
        withdrawStats, withdrawPending, withdrawComplete, withdrawCancelled, withdrawApproved
      ]);
  
      // Construire la réponse JSON
      const stats = {
        rent: {
          count: rent[0],
          countPending: rent[1],
          countProgress: rent[2],
          countComplete: rent[3],
          countCancelled: rent[4],
        },
        sale: {
          count: sale[0],
          countPending: sale[1],
          countProgress: sale[2],
          countCompleted: sale[3],
          countCancelled: sale[4],
        },
        reservation: {
          count: reservation[0],
          countPending: reservation[1],
          countCompleted: reservation[2],
          countProgress: reservation[3],
          countCancelled: reservation[4],
          countConfirmed: reservation[5],
        },
        property: {
          count: property[0],
          countPending: property[1],
          countApproved: property[2],
          countRejected: property[3],
          countAvailable: property[4],
          countReserved: property[5],
        },
        user: {
          count: users[0],
          countAgent: users[1],
          countOwner: users[2],
          countSimple: users[3]
        },
        withdraw: {
          count: withdraw[0],
          countPending: withdraw[1],
          countComplete: withdraw[2],
          countCancelled: withdraw[3],
          countApproved: withdraw[4]
        },
        earn: {
          total: balanceTotalCredit, 
          withdrawalAmount: Math.round(revenues[0][0]?.total || 0),
          withdrawalAmountInPending: Math.round(revenues[1][0]?.total || 0),
          commission: Math.round(revenues[2][0]?.total || 0), 
        }
      };
  
      // Envoyer la réponse JSON
      res.status(200).json(stats);
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  // Soldes pour le locataire
  async getBalanceTenant(req, res) {
    try {
      // Mise à jour des soldes
      await commonService.updateBalanceTenant(req.params.id);

      const tenant = await User.findById(req.params.id);
      if (!tenant) {
        return res.status(404).json({ message: 'Tenant not found' });
      }
      res.status(200).json(tenant.balance.tenant);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  // Soldes pour le propriétaire
  async getBalanceOwner(req, res) {
    try {
      // Mise à jour des soldes
      await commonService.updateBalanceOwner(req.params.id);

      const owner = await User.findById(req.params.id);
      if (!owner) {
        return res.status(404).json({ message: 'Owner not found' });
      }
      res.status(200).json(owner.balance.owner);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = statsController; 