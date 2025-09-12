const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const User = require('../models/User');
const EmailService = require('../services/emailService');
const axios = require('axios');
const { getStatusPayment, getGreeting } = require('../utils/helpers');
const Order = require('../models/Order');
const { generateTemplateHtml } = require('../services/generateTemplateHtml');
const { default: MoneroPayment } = require('../services/servicePayment');
const Referral = require('../models/Referral');
const Affiliate = require('../models/Affiliate');
require('dotenv').config();

const transactionController = {
  // Créer une nouvelle transaction
  async createTransaction(req, res) {
    try {
      const {
        amount,
        orderId,
        userId,
        method,
        paymentId,
      } = req.body;

      console.log(req.body)
      // Vérifier si la propriété existe
      let order 
      if (method === 'orderId') {
        order = await Order.findById(orderId)
          .populate('customer')
          .populate('items.product');
      } else {
        order = await Order.findOne({ reference: paymentId })
          .populate('customer')
          .populate('items.product');
      }
      
      if (!order) {
        return res.status(404).json({ message: 'Commande non trouvée' });
      }

      // Calculer la commission
      const transaction = new Transaction({
        amount,
        customer: userId,
        order: order._id,
        email: order.customer.email,
      });

      await transaction.save();

      // Mise à jour du statut de la reservation
      order.payments.push({
        transaction: transaction._id,
        amount,
        paymentDate: Date.now(),
      });
      await order.save();

      const monero = new MoneroPayment(process.env.MONERO_SECRET_KEY);
      const payment = await monero.initializePayment({
        amount: 100,
        currency: "XOF",
        description: "Paiement pour la commande #"+order._id,
        customer: {
          email: order.customer.email,
          first_name: order.customer.name,
          last_name: order.customer.name,
        },
        return_url: process.env.URL_APP+'paiement?orderId='+order._id,
        metadata: {
          order_id: order._id,
          customer_id: userId,
        },
        methods: ["mtn_bj", "moov_bj", "moov_bf", "moov_ci", 
          "moov_ml", "moov_tg", "mtn_ci"],
      });
      
      console.log(payment)

      if (payment.success) {
        // const ref = payment.data.reference;
        transaction.reference = payment.data.data.id;
        await transaction.save();
      }

      res.status(201).json({
        success: payment.success,
        statusPayment: transaction.status,
        transactionId: transaction._id,
        url: payment.data.data.checkout_url
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message });
    }
  },

  // Get status
  async getStatusPayment(req, res) {
    try {
      console.log(req.body)
      const { paymentId, paymentStatus } = req.body;
      const transaction = await Transaction.findOne({ reference: paymentId });
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction non trouvée' });
      }

      const order = await Order.findById({ _id: transaction.order });
      if (!order) {
        return res.status(404).json({ message: 'Commande non trouvée' });
      }

      let referral = null;
      if (order.affiliate) {
        const affiliate = await Affiliate.findById(order.affiliate);
        if (affiliate) {
          referral = await Referral.findOne({ orderId: order._id });
        }
      }
     
      // if (transaction.status === 'success') {
      //   return res.status(400).json({ message: 'Transaction déjà réussie' });
      // }
      if (paymentStatus === 'success')  {
        transaction.status = 'success';
        transaction.completedAt = new Date();

        order.paymentStatus = 'paid';
        order.paidAmount = order.totalAmount;
        order.completedAt = new Date();

        if (referral) {
          referral.status = 'paid';
          await referral.save();
        }

        await transaction.save();
        await order.save();
        return res.status(200).json({
          status: 'success',
          data: {
            transaction: transaction,
          },
        });
      }

      const monero = new MoneroPayment(process.env.MONERO_SECRET_KEY);
      const response = await monero.verifyPayment(transaction.reference);
      const status = response.data.data.status;
      console.log(response)

      if (status === 'success') {
        transaction.status = 'success';
        transaction.completedAt = new Date();

        order.paymentStatus = 'paid';
        order.paidAmount = order.totalAmount;
        order.completedAt = new Date();

        if (referral) {
          referral.status = 'paid';
          await referral.save();
        }

        await order.save();
        // Mettre à jour la balance du propriétaire
        // await commonService.updateBalanceOwner(transaction.seller); 
      } else if (status === 'pending') {
        transaction.status = 'pending';
      } else {
        transaction.status = 'failed';
      }

      await transaction.save();

      res.status(200).json({
        statusPayment: transaction.status,
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir les rapports de commission
  async getCommissionReports(req, res) {
    try {
      const { startDate, endDate, period } = req.query;
      
      let dateFilter = {};
      if (startDate && endDate) {
        dateFilter = {
          completedAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        };
      }

      // Aggrégation selon la période
      const groupBy = {
        day: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
        week: { $week: "$completedAt" },
        month: { $dateToString: { format: "%Y-%m", date: "$completedAt" } },
        year: { $dateToString: { format: "%Y", date: "$completedAt" } }
      };

      const reports = await Transaction.aggregate([
        { 
          $match: { 
            ...dateFilter,
            status: 'COMPLETED'
          } 
        },
        {
          $group: {
            _id: groupBy[period || 'day'],
            totalTransactions: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
            totalCommission: { $sum: "$commission.amount" },
            transactions: {
              $push: {
                id: "$_id",
                amount: "$amount",
                commission: "$commission",
                type: "$transactionType"
              }
            }
          }
        },
        { $sort: { _id: -1 } }
      ]);

      // Calculer les totaux globaux
      const totals = await Transaction.aggregate([
        {
          $match: {
            ...dateFilter,
            status: 'COMPLETED'
          }
        },
        {
          $group: {
            _id: null,
            totalTransactions: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
            totalCommission: { $sum: "$commission.amount" },
            averageCommission: { $avg: "$commission.amount" }
          }
        }
      ]);

      res.json({
        reports,
        summary: totals[0] || {
          totalTransactions: 0,
          totalAmount: 0,
          totalCommission: 0,
          averageCommission: 0
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Mettre à jour le statut d'une transaction
  async updateTransactionStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, reference } = req.body;
      console.log(req.params)

      const transaction = await Transaction.findById(id);
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction non trouvée' });
      }


      transaction.status = status;
      if (reference) transaction.reference = reference;
      if (status === 'success') {
        transaction.completedAt = new Date();
      }

      await transaction.save();

      res.json({
        message: 'Statut de la transaction mis à jour',
        transaction
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir les détails d'une transaction
  async getTransactionDetails(req, res) {
    try {
      const transaction = await Transaction.findById(req.params.transactionId)
        .populate('property')
        .populate('seller', 'firstName lastName email phoneNumber country city address')
        .populate('buyer', 'firstName lastName email phoneNumber country city address');

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction non trouvée' });
      }

      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getPaymentsByUserTenant(req, res) {
    try {
      const transaction = await Transaction.find({ buyer: req.params.id })
        .populate({ path: 'reservation', populate: { path: 'property' }})
        .populate('seller', 'name phoneNumber email picture phoneNumber country city address')
        .sort({ createdAt: -1 })

      res.json(transaction);
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message });
    }
  },

  async getPaymentsByUserOwner(req, res) {
    try {
      const transaction = await Transaction.find({ buyer: req.params.id })
        .populate({ path: 'reservation', populate: { path: 'property' }})
        .populate('seller', 'name phoneNumber email picture phoneNumber country city address')
        .populate('buyer', 'firstName lastName email phoneNumber country city address')
        .sort({ createdAt: -1 });

      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },


  async getPaymentsBySeller(req, res) {
    try {
      let transactions;

      // Si l'utilisateur est super_admin, il voit toutes les transactions
      if (req?.user?.role === 'super_admin') {
        transactions = await Transaction.find()
          .populate('order')
          .populate('customer')
          .sort({ createdAt: -1 });
      }
      // Si l'utilisateur est admin, il ne voit que les transactions liées à ses produits
      else if (req?.user?.role === 'admin') {
        const adminId = req?.user?._id;
        
        // Récupérer les produits assignés à cet admin
        const Product = require('../models/Product');
        const adminProducts = await Product.find({ assignedAdminId: adminId }).select('_id');
        const productIds = adminProducts.map(product => product._id);

        // Récupérer les commandes contenant les produits de cet admin
        const Order = require('../models/Order');
        const adminOrders = await Order.find({
          'items.product': { $in: productIds }
        }).select('_id');
        const orderIds = adminOrders.map(order => order._id);

        // Récupérer les transactions liées à ces commandes
        transactions = await Transaction.find({
          order: { $in: orderIds }
        })
          .populate('order')
          .populate('customer')
          .sort({ createdAt: -1 });
      } else {
        // Si le rôle n'est ni super_admin ni admin
        return res.status(403).json({ 
          success: false,
          message: "Accès non autorisé" 
        });
      }

      res.json(transactions);
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message });
    }
  },

  async getPaymentsById(req, res) {
    try {
      const transaction = await Transaction.findOne({ _id: req.params.id })
        .populate('order')
        .populate('customer')

      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 
  async updateWithdrawableAmount(req, res) {
    try {
      const { id, adminId, owner } = req.params;
  
      const transaction = await Transaction.findById(id);
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction non trouvée' });
      }
  
      transaction.withdrawable = !transaction.withdrawable;
      transaction.withdrawableBy = adminId;
      await transaction.save();
  
      const ownerUser = await User.findById(owner);
      if (!ownerUser) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
  
      if (!ownerUser.balance) {
        ownerUser.balance = { totalWithdrawable: 0 };
      }
  
      if (transaction.withdrawable) {
        ownerUser.balance.totalWithdrawable += transaction.amount;
      } else {
        ownerUser.balance.totalWithdrawable = Math.max(0, ownerUser.balance.totalWithdrawable - transaction.amount);
      }
  
      await ownerUser.save();
  
      res.json({
        message: 'Statut de la transaction mis à jour avec succès.',
        transaction
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
};

module.exports = transactionController; 