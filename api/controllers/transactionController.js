const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const Expense = require('../models/Expense');
const User = require('../models/User');
const Reservation = require('../models/Reservation');
const EmailService = require('../services/emailService');
const axios = require('axios');
const { getStatusPayment, getGreeting } = require('../utils/helpers');
const commonService = require('../services/commonService');
const Order = require('../models/Order');
const { generateTemplateHtml } = require('../services/generateTemplateHtml');

const transactionController = {
  // Créer une nouvelle transaction
  async createTransaction(req, res) {
    try {
      const {
        amount,
        paymentMethod,
        orderId,
        userId,
        paymentNumber,
        email,
        name,
        mobileProvider,
      } = req.body;

      console.log(req.body)
      // Vérifier si la propriété existe
      const order = await Order.findById(orderId)
          .populate('customer')
          .populate('items.product');
      
      if (!order) {
        return res.status(404).json({ message: 'Commande non trouvée' });
      }

      // Calculer la commission
      const transaction = new Transaction({
        amount,
        customer: userId,
        order: orderId,
        paymentMethod: paymentMethod.toUpperCase(),
        mobileProvider: mobileProvider.toUpperCase(),
        paymentNumber,
        email,
      });

      await transaction.save();

      // Mise à jour du statut de la reservation
      order.payments.push({
        transaction: transaction._id,
        amount,
        paymentDate: Date.now(),
      });
      await order.save();

      const urls_pay = {
        "MTN": "https://api.feexpay.me/api/transactions/public/requesttopay/mtn",
        "MOOV": "https://api.feexpay.me/api/transactions/public/requesttopay/moov",
        "CELTIIS": "https://api.feexpay.me/api/transactions/public/requesttopay/celtiis_bj",
        "CARD": "https://api.feexpay.me/api/transactions/public/initcard",
        // "MASTERCARD": "https://api.feexpay.me/api/transactions/public/initcard",
      }

      // payment
      const method = mobileProvider.toUpperCase() === 'CELTIIS' ? 'CELTIIS BJ' : mobileProvider.toUpperCase();
      const payload = {
        name: name,
        firstName: name,
        phoneNumber: paymentNumber,
        amount: 1,
        // amount: paidAmount,
        network: method,
        shop: process.env.SHOP_ID,
      }

      const res1 = await axios.post(urls_pay[method], payload, {
        headers: {
            "Authorization": `Bearer ${process.env.API_KEY}`
        }
      });

      if (res1.status === 200 || res1.status === 202) {
        const ref = res1.data.reference;
        transaction.reference = ref;
        
        await new Promise(resolve => setTimeout(resolve, 30000));
        // Mettre la transaction avec la reference du paiement
        const res2 = await getStatusPayment(ref);
        const status = res2.data.status;

        if (status === 'SUCCESSFUL') {

          if (order.status !== 'confirmed') {
            for (const item of order.items) {
              const product = await Product.findById(item.product);
              if (product) {
                product.stock.available = product.stock.available - item.quantity;
                product.stock.sold = product.stock.sold || 0 + item.quantity;
                
                if (product.stock.available === 0) {
                  product.state = 'unavailable';
                } else {
                  product.state = 'available';
                }
                await product.save();
              }
            }
            order.status = 'confirmed';
            await order.save();
          }

          transaction.status = 'success';
          transaction.completedAt = new Date();

          // Mettre à jour le statut de la commande
          const paidAmount = order.payments.reduce((total, item) =>  item.status === 'success' ? total + Number(item.amount) : total, 0);
          order.paidAmount = paidAmount;

          if (paidAmount === order.totalAmount) {
            order.paymentStatus = 'paid';
          } else {
            order.paymentStatus = 'partiallyPaid';
          }
          
          // Mettre à jour la balance du propriétaire
          await commonService.updateBalanceOwner(order.customer); 
        } else if (['FAILED', 'PENDING'].includes(status)) {
          transaction.status = status === 'FAILED' ? 'failed':'pending';

          // mail
          const templateData = {
            fullname: name,
            amount: amount,
            orderId: order._id,
            payId: transaction._id,
            status: transaction.status,
            salutation: getGreeting(),
          };

          const emailService = new EmailService();
          emailService.setSubject(`Paiement non effectué sur STORE`);
          emailService.setFrom(process.env.EMAIL_HOST_USER, "STORE");
          emailService.addTo(email);
          emailService.setHtml(generateTemplateHtml("templates/notificationPaymentCustomerFailed.html", templateData));
          await emailService.send();
        } 

        await transaction.save();
        await order.save();
      }

         // Noitification
      const templateData = {
        fullname: name,
        amount: amount,
        orderId: order._id,
        payId: transaction._id,
        status: transaction.status,
        salutation: getGreeting(),
      };

      if (transaction.status === 'success') {
        const emailService = new EmailService();
        emailService.setSubject(`Paiement effectué avec succès sur STORE`);
        emailService.setFrom(process.env.EMAIL_HOST_USER, "STORE");
        emailService.addTo(email);
        emailService.setHtml(generateTemplateHtml("templates/notificationPaymentCustomer.html", templateData));
        await emailService.send();

        const emailServiceAdmin = new EmailService();
        emailServiceAdmin.setSubject(`Nouveau paiement sur STORE`);
        emailServiceAdmin.setFrom(process.env.EMAIL_HOST_USER, "STORE");
        emailServiceAdmin.addTo(process.env.EMAIL_HOST_USER);
        emailServiceAdmin.setHtml(generateTemplateHtml("templates/notificationPaymentAdmin.html", templateData));
        await emailServiceAdmin.send();

        const notification = new Notification({
          type: 'payment',
          message: `Nouveau paiement sur STORE. ID: PAY-${transaction._id}`,
          user: null,
          data: JSON.stringify(transaction),
        });
        await notification.save();
      }

      res.status(201).json({
        statusPayment: transaction.status,
        reference: transaction.reference,
        transactionId: transaction._id,
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message });
    }
  },

  // Get status
  async getStatusPayment(req, res) {
    try {
      const { payId } = req.params;
      const transaction = await Transaction.findById(payId);
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction non trouvée' });
      }

      // if (transaction.status === 'success') {
      //   return res.status(400).json({ message: 'Transaction déjà réussie' });
      // }

      const response = await getStatusPayment(transaction.reference);
      const status = response.data.status;

      if (status === 'SUCCESSFUL') {
        transaction.status = 'success';

        // Mettre à jour la balance du propriétaire
        await commonService.updateBalanceOwner(transaction.seller); 
      } else if (status === 'PENDING') {
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

      const reservation = await Reservation.findById(transaction.reservation);
      if (!reservation) {
        return res.status(404).json({ message: 'Reservation non trouvée' });
      }

      const property = await Product.findById(reservation.property);
      if (!property) {
        return res.status(404).json({ message: 'Product non trouvée' });
      }

      transaction.status = status;
      if (reference) transaction.reference = reference;
      if (status === 'success') {
        transaction.completedAt = new Date();

        reservation.status = 'confirmed';
        reservation.paidAmount = transaction.amount;
        await reservation.save();

        if (property.state === 'available') {
          property.status = 'unavailable';
          property.stock.available = property.stock.available - reservation.quantity;
          property.stock.rented = property.stock.total - property.stock.available;
          await property.save();
        }
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

  async getExpenseByUser(req, res) {
    try {
      const expenses = await Expense.find({ user: req.params.id })
        .populate('user');

      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getPaymentsBySeller(req, res) {
    try {
      const transaction = await Transaction.find()
        .populate('order')
        .populate('customer')
        .sort({ createdAt: -1 });

      res.json(transaction);
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