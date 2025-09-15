const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const UserVisit = require('../models/UserVisit');

const statsController = {

  async getStatsByOwner(req, res) {
    try {

      // Si l'utilisateur est super_admin, on renvoie les statistiques globales
      if (req.user.role === 'super_admin') {
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

        const salesRevenue = await Order.find({ paymentStatus: "paid" })
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
      if (req.user.role === 'admin') {
        const adminId = req.user._id;

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
          paymentStatus: "paid" 
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

      const ordersCount = await Order.countDocuments({ customer: userId });
      const orderPending = await Order.countDocuments({ customer: userId, status: "pending" });
      const orderConfirmed = await Order.countDocuments({ customer: userId, status: "confirmed" });
      const orderShipped = await Order.countDocuments({ customer: userId, status: "shipped" });
      const orderDelivered = await Order.countDocuments({ customer: userId, status: "delivered" });
      const orderCancelled = await Order.countDocuments({ customer: userId, status: "cancelled" });

      const salesRevenue = await Order.find({ customer: userId, status: "confirmed" })
        .populate("payments.transaction")
        .sort({createdAt: -1});

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

      const role = req.user?.role;

      // Si l'utilisateur est super_admin, on renvoie les revenus globaux
      if (role === 'super_admin') {
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
      else if (role === 'admin') {
        const adminId = req.user?._id;
        
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

  async getSalesStats(req, res) {
    try {
      const { period = 'year', year, month, date } = req.query;
      
      // Validation des paramètres
      if (!['day', 'month', 'year'].includes(period)) {
        return res.status(400).json({ message: "Période invalide. Utilisez: day, month, ou year" });
      }

      const targetYear = year ? parseInt(year) : new Date().getFullYear();
      const targetMonth = month ? parseInt(month) - 1 : new Date().getMonth();
      const targetDate = date ? new Date(date) : new Date();

      // Validation des dates
      if (isNaN(targetYear) || targetYear < 2000 || targetYear > 2100) {
        return res.status(400).json({ message: "Année invalide" });
      }

      if (period === 'month' && (isNaN(targetMonth) || targetMonth < 0 || targetMonth > 11)) {
        return res.status(400).json({ message: "Mois invalide" });
      }

      if (period === 'day' && isNaN(targetDate.getTime())) {
        return res.status(400).json({ message: "Date invalide" });
      }

      const role = req.user?.role;
      let productIds = [];
      console.log(role)
      // Si l'utilisateur est admin, récupérer ses produits
      if (role === 'admin') {
        const adminId = req.user?._id;
        if (!adminId) {
          return res.status(400).json({ message: "ID administrateur manquant" });
        }
        const adminProducts = await Product.find({ assignedAdminId: adminId }).select('_id');
        productIds = adminProducts.map(product => product._id);
      } else if (role === 'super_admin') {
        const products = await Product.find().select('_id');
        productIds = products.map(product => product._id);
      } else if (role !== 'super_admin') {
        return res.status(403).json({ message: "Accès non autorisé" });
      }

      let labels = [];
      let salesData = [];
      let ordersData = [];

      console.log(productIds.length)

      if (period === 'day') {
        // Statistiques par heure pour un jour donné
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        for (let hour = 0; hour < 24; hour++) {
          const startHour = new Date(startOfDay);
          startHour.setHours(hour);
          const endHour = new Date(startOfDay);
          endHour.setHours(hour + 1);

          labels.push(`${hour}h`);

          const query = {
            createdAt: { $gte: startHour, $lt: endHour },
            paymentStatus: 'paid'
          };

          // if (role === 'admin') {
            query['items.product'] = { $in: productIds };
          // }

          const orders = await Order.find(query).select('totalAmount');
          const hourRevenue = orders.reduce((total, order) => total + (order.totalAmount || 0), 0);
          
          salesData.push(Math.round(hourRevenue));
          ordersData.push(orders.length);
        }
      } else if (period === 'month') {
        // Statistiques par jour pour un mois donné
        const startOfMonth = new Date(targetYear, targetMonth, 1);
        const endOfMonth = new Date(targetYear, targetMonth + 1, 0);
        const daysInMonth = endOfMonth.getDate();

        for (let day = 1; day <= daysInMonth; day++) {
          const startOfDay = new Date(targetYear, targetMonth, day, 0, 0, 0);
          const endOfDay = new Date(targetYear, targetMonth, day, 23, 59, 59);

          labels.push(`${day}`);

          const query = {
            createdAt: { $gte: startOfDay, $lte: endOfDay },
            paymentStatus: 'paid'
          };

          // if (role === 'admin') {
            query['items.product'] = { $in: productIds };
          // }

          const orders = await Order.find(query).select('totalAmount');
          const dayRevenue = orders.reduce((total, order) => total + (order.totalAmount || 0), 0);
          
          salesData.push(Math.round(dayRevenue));
          ordersData.push(orders.length);
        }
      } else {
        // Statistiques par mois pour une année (par défaut)
        for (let month = 0; month < 12; month++) {
          const startOfMonth = new Date(targetYear, month, 1);
          const endOfMonth = new Date(targetYear, month + 1, 0, 23, 59, 59);
          
          const monthName = startOfMonth.toLocaleDateString('fr-FR', { month: 'short' });
          labels.push(monthName);
          
          const query = {
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
            paymentStatus: 'paid'
          };

          // if (role === 'admin') {
            query['items.product'] = { $in: productIds };
          // }

          const orders = await Order.find(query).select('totalAmount');
          const monthRevenue = orders.reduce((total, order) => total + (order.totalAmount || 0), 0);
          
          salesData.push(Math.round(monthRevenue));
          ordersData.push(orders.length);
        }
      }
      
      const totalRevenue = salesData.reduce((sum, revenue) => sum + revenue, 0);
      const totalOrders = ordersData.reduce((sum, orders) => sum + orders, 0);
      
      res.status(200).json({
        labels,
        salesData,
        ordersData,
        totalRevenue,
        totalOrders,
        period,
        year: targetYear,
        month: targetMonth + 1,
        date: targetDate
      });
    } catch (error) {
      console.error('Erreur dans getSalesStats:', error);
      res.status(500).json({ 
        message: "Erreur lors de la récupération des statistiques de vente",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async getSalesByCountry(req, res) {
    try {
      const { year, month, limit = 10 } = req.query;
      const targetYear = year ? parseInt(year) : new Date().getFullYear();
      const targetMonth = month ? parseInt(month) - 1 : null;

      // Validation des paramètres
      if (isNaN(targetYear) || targetYear < 2000 || targetYear > 2100) {
        return res.status(400).json({ message: "Année invalide" });
      }

      if (targetMonth !== null && (isNaN(targetMonth) || targetMonth < 0 || targetMonth > 11)) {
        return res.status(400).json({ message: "Mois invalide" });
      }

      const role = req.user?.role;
      let productIds = [];

      // Si l'utilisateur est admin, récupérer ses produits
      if (role === 'admin') {
        const adminId = req.user?._id;
        if (!adminId) {
          return res.status(400).json({ message: "ID administrateur manquant" });
        }
        const adminProducts = await Product.find({ assignedAdminId: adminId }).select('_id');
        productIds = adminProducts.map(product => product._id);
      } else if (role === 'super_admin') {
        const products = await Product.find().select('_id');
        productIds = products.map(product => product._id);
      } else {
        return res.status(403).json({ message: "Accès non autorisé" });
      }

      // Construire la plage de dates
      let dateQuery = {};
      if (targetMonth !== null) {
        // Statistiques pour un mois spécifique
        const startOfMonth = new Date(targetYear, targetMonth, 1);
        const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);
        dateQuery = { $gte: startOfMonth, $lte: endOfMonth };
      } else {
        // Statistiques pour toute l'année
        const startOfYear = new Date(targetYear, 0, 1);
        const endOfYear = new Date(targetYear, 11, 31, 23, 59, 59);
        dateQuery = { $gte: startOfYear, $lte: endOfYear };
      }

      // Pipeline d'agrégation MongoDB
      const pipeline = [
        {
          $match: {
            createdAt: dateQuery,
            paymentStatus: 'paid',
            country: { $exists: true, $ne: null, $ne: '' },
            ...(role === 'admin' && productIds.length > 0 ? { 'items.product': { $in: productIds } } : role === 'super_admin' ? { 'items.product': { $in: productIds } } : {})
          }
        },
        {
          $group: {
            _id: '$country',
            totalRevenue: { $sum: '$totalAmount' },
            totalOrders: { $sum: 1 },
            averageOrderValue: { $avg: '$totalAmount' }
          }
        },
        {
          $sort: { totalRevenue: -1 }
        },
        {
          $limit: parseInt(limit)
        },
        {
          $project: {
            country: '$_id',
            totalRevenue: { $round: ['$totalRevenue', 0] },
            totalOrders: 1,
            averageOrderValue: { $round: ['$averageOrderValue', 0] },
            _id: 0
          }
        }
      ];

      const salesByCountry = await Order.aggregate(pipeline);

      // Calculer les totaux globaux
      const querys = {
        createdAt: dateQuery,
        paymentStatus: 'paid',
        ...(role === 'admin' ? productIds.length > 0 ? { 'items.product': { $in: productIds } } : {} : role === 'super_admin' ? productIds.length > 0 ? { 'items.product': { $in: productIds } } : {} : {})
      }
      const totalStats = await Order.aggregate([
        {
          $match: querys
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            totalOrders: { $sum: 1 }
          }
        }
      ]);

      const globalStats = totalStats[0] || { totalRevenue: 0, totalOrders: 0 };

      // Calculer les pourcentages
      const salesWithPercentages = salesByCountry.map(country => ({
        ...country,
        revenuePercentage: globalStats.totalRevenue > 0 
          ? Math.round((country.totalRevenue / globalStats.totalRevenue) * 100 * 100) / 100 
          : 0,
        ordersPercentage: globalStats.totalOrders > 0 
          ? Math.round((country.totalOrders / globalStats.totalOrders) * 100 * 100) / 100 
          : 0
      }));

      res.status(200).json({
        countries: salesWithPercentages,
        totalRevenue: Math.round(globalStats.totalRevenue),
        totalOrders: globalStats.totalOrders,
        period: targetMonth !== null ? 'month' : 'year',
        year: targetYear,
        month: targetMonth !== null ? targetMonth + 1 : null,
        topCountriesCount: salesByCountry.length
      });

    } catch (error) {
      console.error('Erreur dans getSalesByCountry:', error);
      res.status(500).json({ 
        message: "Erreur lors de la récupération des statistiques par pays",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
 
};

module.exports = statsController; 