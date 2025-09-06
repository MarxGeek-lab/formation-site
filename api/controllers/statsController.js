const { default: mongoose, Types } = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const UserVisit = require('../models/UserVisit');

const statsController = {

  async getStatsByOwner(req, res) {
    try {
      // Si l'utilisateur est super_admin, on renvoie les statistiques globales
      if (req.user.user.role === 'super_admin') {
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
      }

      // Si l'utilisateur est admin, on renvoie les stats liées à ses produits
      if (req.user.user.role === 'admin') {
        const adminId = req.user.user._id;

        // Récupérer les produits assignés à cet admin
        const adminProducts = await Product.find({ assignedAdminId: adminId }).select('_id');
        const productIds = adminProducts.map(product => product._id);

        // Récupérer les commandes contenant les produits de cet admin
        const adminOrders = await Order.find({
          'items.product': { $in: productIds }
        }).select('_id status');

        const adminOrderIds = adminOrders.map(order => order._id);

        const [
          ordersCount,
          ordersPending,
          ordersConfirmed,
          ordersShipped,
          ordersDelivered,
          ordersCancelled,
          productsCount,
        ] = await Promise.all([
          Order.countDocuments({ _id: { $in: adminOrderIds } }),
          Order.countDocuments({ _id: { $in: adminOrderIds }, status: "pending" }),
          Order.countDocuments({ _id: { $in: adminOrderIds }, status: "confirmed" }),
          Order.countDocuments({ _id: { $in: adminOrderIds }, status: "shipped" }),
          Order.countDocuments({ _id: { $in: adminOrderIds }, status: "delivered" }),
          Order.countDocuments({ _id: { $in: adminOrderIds }, status: "cancelled" }),
          Product.countDocuments({ assignedAdminId: adminId }),
        ]);

        // Calculer les revenus pour les commandes de cet admin
        const salesRevenue = await Order.find({ 
          _id: { $in: adminOrderIds },
          status: "completed" 
        }).populate('payments.transaction');

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
          usersCount: 0, // Les admins n'ont pas accès aux stats utilisateurs
          userVisitCount: 0, // Les admins n'ont pas accès aux stats de visites
          productsCount: productsCount,
        });
      }

      // Si le rôle n'est ni super_admin ni admin
      return res.status(403).json({ message: "Accès non autorisé" });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },

  async getStatsByBuyer(req, res) {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

      const ordersCount = await Order.find({ customer: userId });
      const orderPending = await Order.countDocuments({ customer: userId, status: "pending" });
      const orderConfirmed = await Order.countDocuments({ customer: userId, status: "confirmed" });
      const orderShipped = await Order.countDocuments({ customer: userId, status: "shipped" });
      const orderDelivered = await Order.countDocuments({ customer: userId, status: "delivered" });
      const orderCancelled = await Order.countDocuments({ customer: userId, status: "cancelled" });

      const salesRevenue = await Order.find({ customer: userId, status: "completed" });
      const totalSalesRevenue = salesRevenue.reduce((total, order) => {
        return total + order.payments.reduce((paymentTotal, payment) => {
          return payment.transaction.status === "success" && payment.transaction.type === "payment" ? paymentTotal + payment.transaction.amount : paymentTotal;
        }, 0);
      }, 0);

      res.status(200).json({
        ordersCount,
        orderPending,
        orderConfirmed,
        orderShipped,
        orderDelivered,
        orderCancelled,
        expense: totalSalesRevenue,
      })
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },

  async getStats(req, res) {
    try {
      const productsCount = await Product.countDocuments({ isDeleted: false });
      const usersCount = await User.countDocuments();
      const ordersCount = await Order.countDocuments();
      const userVisitCount = await UserVisit.countDocuments();

      const stats = {
        productsCount,
        usersCount,
        ordersCount,
        userVisitCount
      };

      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getRevenueStats(req, res) {
    try {
      const { year } = req.query;
      const targetYear = year ? parseInt(year) : new Date().getFullYear();
      
      const months = [];
      const monthlyRevenue = [];

      // Si l'utilisateur est super_admin, on renvoie les revenus globaux
      if (req.user.user.role === 'super_admin') {
        // Générer les 12 mois de l'année spécifiée
        for (let month = 0; month < 12; month++) {
          // Début et fin du mois
          const startOfMonth = new Date(targetYear, month, 1);
          const endOfMonth = new Date(targetYear, month + 1, 0, 23, 59, 59);
          
          // Nom du mois
          const monthName = startOfMonth.toLocaleDateString('fr-FR', { month: 'short' });
          months.push(monthName);
          
          // Calculer les revenus pour ce mois (toutes les commandes)
          const orders = await Order.find({
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
            paymentStatus: 'paid'
          });
          
          const monthRevenue = orders.reduce((total, order) => {
            return total + (order.totalAmount || 0);
          }, 0);
          
          monthlyRevenue.push(Math.round(monthRevenue));
        }
      }
      // Si l'utilisateur est admin, on renvoie les revenus liés à ses produits
      else if (req.user.user.role === 'admin') {
        const adminId = req.user.user._id;
        
        // Récupérer les produits assignés à cet admin
        const adminProducts = await Product.find({ assignedAdminId: adminId }).select('_id');
        const productIds = adminProducts.map(product => product._id);

        // Générer les 12 mois de l'année spécifiée
        for (let month = 0; month < 12; month++) {
          // Début et fin du mois
          const startOfMonth = new Date(targetYear, month, 1);
          const endOfMonth = new Date(targetYear, month + 1, 0, 23, 59, 59);
          
          // Nom du mois
          const monthName = startOfMonth.toLocaleDateString('fr-FR', { month: 'short' });
          months.push(monthName);
          
          // Calculer les revenus pour ce mois (seulement les commandes contenant les produits de l'admin)
          const orders = await Order.find({
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
            paymentStatus: 'paid',
            'items.product': { $in: productIds }
          });
          
          const monthRevenue = orders.reduce((total, order) => {
            return total + (order.totalAmount || 0);
          }, 0);
          
          monthlyRevenue.push(Math.round(monthRevenue));
        }
      } else {
        // Si le rôle n'est ni super_admin ni admin
        return res.status(403).json({ message: "Accès non autorisé" });
      }
      
      // Calculer le total des revenus
      const totalRevenue = monthlyRevenue.reduce((sum, revenue) => sum + revenue, 0);
      
      res.status(200).json({
        months,
        monthlyRevenue,
        totalRevenue,
        currentYear: targetYear
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
 
};

module.exports = statsController; 