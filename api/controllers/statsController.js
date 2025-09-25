const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const UserVisit = require('../models/UserVisit');

const statsController = {

  async getStatsByOwner(req, res) {
    try {
      // Cas super_admin : stats globales
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
  
        // Calcul direct du revenu total via aggregation
        const revenueResult = await Order.aggregate([
          { $match: { paymentStatus: "paid", fromOrder: { $nin: ["from admin"] } } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
  
        const totalSalesRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
  
        const result = {
          countOrders: ordersCount,
          countOrdersPending: ordersPending,
          countOrdersConfirmed: ordersConfirmed,
          countOrdersShipped: ordersShipped,
          countOrdersDelivered: ordersDelivered,
          countOrdersCancelled: ordersCancelled,
          salesRevenue: totalSalesRevenue,
          usersCount,
          userVisitCount,
          productsCount,
        };
  
        console.log(result);
        return res.status(200).json(result);
      }
  
      // Cas admin : stats limitées aux produits assignés
      if (req.user.role === 'admin') {
        const adminId = req.user._id;
  
        // Produits de cet admin
        const adminProducts = await Product.find({ assignedAdminId: adminId }).select('_id');
        const productIds = adminProducts.map(p => p._id);
  
        if (productIds.length === 0) {
          return res.status(200).json({
            countOrders: 0,
            countOrdersPending: 0,
            countOrdersConfirmed: 0,
            countOrdersShipped: 0,
            countOrdersDelivered: 0,
            countOrdersCancelled: 0,
            salesRevenue: 0,
            usersCount: 0,
            userVisitCount: 0,
            productsCount: 0,
          });
        }
  
        // Commandes contenant ces produits
        const adminOrders = await Order.find({
          "items.product": { $in: productIds }
        }).select('_id status');
  
        const adminOrderIds = adminOrders.map(o => o._id);
  
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
  
        // Revenu via aggregation
        const revenueResult = await Order.aggregate([
          { $match: { _id: { $in: adminOrderIds }, paymentStatus: "paid" } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
  
        const totalSalesRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
  
        const result = {
          countOrders: ordersCount,
          countOrdersPending: ordersPending,
          countOrdersConfirmed: ordersConfirmed,
          countOrdersShipped: ordersShipped,
          countOrdersDelivered: ordersDelivered,
          countOrdersCancelled: ordersCancelled,
          salesRevenue: totalSalesRevenue,
          usersCount: 0,       // pas accessible pour admin
          userVisitCount: 0,   // pas accessible pour admin
          productsCount,
        };
  
        console.log(result);
        return res.status(200).json(result);
      }
  
      // Si rôle non autorisé
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
  
      if (!['day', 'month', 'year'].includes(period)) {
        return res.status(400).json({ message: "Période invalide. Utilisez: day, month, ou year" });
      }
  
      const targetYear = year ? parseInt(year) : new Date().getFullYear();
      const targetMonth = month ? parseInt(month) - 1 : new Date().getMonth();
      const targetDate = date ? new Date(date) : new Date();
  
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
  
      if (role === 'admin') {
        const adminId = req.user?._id;
        if (!adminId) {
          return res.status(400).json({ message: "ID administrateur manquant" });
        }
        const adminProducts = await Product.find({ assignedAdminId: adminId }).select('_id');
        productIds = adminProducts.map(p => p._id);
      } else if (role !== 'super_admin') {
        return res.status(403).json({ message: "Accès non autorisé" });
      }
  
      let labels = [];
      let salesData = [];
      let ordersData = [];
  
      if (period === 'day') {
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
  
        for (let hour = 0; hour < 24; hour++) {
          const startHour = new Date(startOfDay);
          startHour.setHours(hour, 0, 0, 0);
          const endHour = new Date(startOfDay);
          endHour.setHours(hour + 1, 0, 0, 0);
  
          labels.push(`${hour}h`);
  
          const query = {
            createdAt: { $gte: startHour, $lt: endHour },
            paymentStatus: 'paid',
            fromOrder: { $nin: ["from admin"] }
          };
  
          if (role === 'admin') {
            query['items.product'] = { $in: productIds };
          }
  
          const orders = await Order.find(query).select('totalAmount');
          const hourRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  
          salesData.push(Math.round(hourRevenue));
          ordersData.push(orders.length);
        }
      } else if (period === 'month') {
        const startOfMonth = new Date(targetYear, targetMonth, 1);
        const endOfMonth = new Date(targetYear, targetMonth + 1, 0);
        const daysInMonth = endOfMonth.getDate();
  
        for (let day = 1; day <= daysInMonth; day++) {
          const startOfDay = new Date(targetYear, targetMonth, day, 0, 0, 0);
          const endOfDay = new Date(targetYear, targetMonth, day, 23, 59, 59);
  
          labels.push(`${day}`);
  
          const query = {
            createdAt: { $gte: startOfDay, $lte: endOfDay },
            paymentStatus: 'paid',
            fromOrder: { $nin: ["from admin"] }
          };
  
          if (role === 'admin') {
            query['items.product'] = { $in: productIds };
          }
  
          const orders = await Order.find(query).select('totalAmount');
          const dayRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  
          salesData.push(Math.round(dayRevenue));
          ordersData.push(orders.length);
        }
      } else {
        for (let m = 0; m < 12; m++) {
          const startOfMonth = new Date(targetYear, m, 1, 0, 0, 0, 0);
          const endOfMonth = new Date(targetYear, m + 1, 0, 23, 59, 59, 999);
  
          const monthName = startOfMonth.toLocaleDateString('fr-FR', { month: 'short' });
          labels.push(monthName);
  
          const query = {
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
            paymentStatus: 'paid',
            fromOrder: { $nin: ["from admin"] }
          };
  
          if (role === 'admin') {
            query['items.product'] = { $in: productIds };
          }
  
          const orders = await Order.find(query).select('totalAmount');
          const monthRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  
          salesData.push(Math.round(monthRevenue));
          ordersData.push(orders.length);
        }
      }
  
      const totalRevenue = salesData.reduce((sum, r) => sum + r, 0);
      const totalOrders = ordersData.reduce((sum, o) => sum + o, 0);
  
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
  
      // Validation
      if (isNaN(targetYear) || targetYear < 2000 || targetYear > 2100) {
        return res.status(400).json({ message: "Année invalide" });
      }
      if (targetMonth !== null && (isNaN(targetMonth) || targetMonth < 0 || targetMonth > 11)) {
        return res.status(400).json({ message: "Mois invalide" });
      }
  
      const role = req.user?.role;
      let productIds = [];
  
      if (role === "admin") {
        const adminId = req.user?._id;
        if (!adminId) {
          return res.status(400).json({ message: "ID administrateur manquant" });
        }
        const adminProducts = await Product.find({ assignedAdminId: adminId }).select("_id");
        productIds = adminProducts.map(p => p._id);
      } else if (role !== "super_admin") {
        return res.status(403).json({ message: "Accès non autorisé" });
      }
  
      // Construire la plage de dates
      let dateQuery;
      if (targetMonth !== null) {
        const startOfMonth = new Date(targetYear, targetMonth, 1);
        const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);
        dateQuery = { $gte: startOfMonth, $lte: endOfMonth };
      } else {
        const startOfYear = new Date(targetYear, 0, 1);
        const endOfYear = new Date(targetYear, 11, 31, 23, 59, 59);
        dateQuery = { $gte: startOfYear, $lte: endOfYear };
      }
  
      // Base du $match
      const baseMatch = {
        createdAt: dateQuery,
        paymentStatus: "paid",
        country: { $exists: true, $ne: null, $ne: "" }
      };
  
      // Ajouter la restriction seulement si admin
      if (role === "admin" && productIds.length > 0) {
        baseMatch["items.product"] = { $in: productIds };
      }
  
      // Agrégation par pays
      const pipeline = [
        { $match: baseMatch },
        {
          $group: {
            _id: "$country",
            totalRevenue: { $sum: "$totalAmount" },
            totalOrders: { $sum: 1 },
            averageOrderValue: { $avg: "$totalAmount" }
          }
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: parseInt(limit) },
        {
          $project: {
            country: "$_id",
            totalRevenue: { $round: ["$totalRevenue", 0] },
            totalOrders: 1,
            averageOrderValue: { $round: ["$averageOrderValue", 0] },
            _id: 0
          }
        }
      ];
  
      const salesByCountry = await Order.aggregate(pipeline);
  
      // Statistiques globales (totaux)
      const totalStats = await Order.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
            totalOrders: { $sum: 1 }
          }
        }
      ]);
  
      const globalStats = totalStats[0] || { totalRevenue: 0, totalOrders: 0 };
  
      // Ajouter les pourcentages
      const salesWithPercentages = salesByCountry.map(c => ({
        ...c,
        revenuePercentage:
          globalStats.totalRevenue > 0
            ? Math.round((c.totalRevenue / globalStats.totalRevenue) * 100 * 100) / 100
            : 0,
        ordersPercentage:
          globalStats.totalOrders > 0
            ? Math.round((c.totalOrders / globalStats.totalOrders) * 100 * 100) / 100
            : 0
      }));
  
      res.status(200).json({
        countries: salesWithPercentages,
        totalRevenue: Math.round(globalStats.totalRevenue),
        totalOrders: globalStats.totalOrders,
        period: targetMonth !== null ? "month" : "year",
        year: targetYear,
        month: targetMonth !== null ? targetMonth + 1 : null,
        topCountriesCount: salesByCountry.length
      });
    } catch (error) {
      console.error("Erreur dans getSalesByCountry:", error);
      res.status(500).json({
        message: "Erreur lors de la récupération des statistiques par pays",
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      });
    }
  }
,  

async getMostSoldProducts(req, res) {
  try {
    const { limit = 1000 } = req.query;
    const role = req.user?.role;

    let productIds = [];
    if (role === 'admin') {
      const adminId = req.user?._id;
      if (!adminId) return res.status(400).json({ message: "ID administrateur manquant" });
      const adminProducts = await Product.find({ assignedAdminId: adminId }).select('_id');
      productIds = adminProducts.map(p => p._id);
    } else if (role === 'super_admin') {
      const products = await Product.find().select('_id');
      productIds = products.map(p => p._id);
    } else {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    const pipeline = [
      { $match: { paymentStatus: 'paid', 'items.product': { $in: productIds } } },
      { $unwind: "$items" },
      { $match: { 'items.product': { $in: productIds } } },
      // Compter une seule fois le produit par commande
      {
        $group: {
          _id: { orderId: "$_id", productId: "$items.product" },
          quantity: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
        }
      },
      // Grouper par produit pour obtenir totaux et nombre de commandes distinctes
      {
        $group: {
          _id: "$_id.productId",
          totalQuantitySold: { $sum: "$quantity" },
          totalRevenue: { $sum: "$revenue" },
          totalOrders: { $sum: 1 } // nombre de commandes distinctes contenant ce produit
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          productId: "$_id",
          productName: "$productDetails.name",
          productImage: "$productDetails.photos",
          category: "$productDetails.category",
          totalQuantitySold: 1,
          totalRevenue: { $round: ["$totalRevenue", 0] },
          totalOrders: 1,
          _id: 0
        }
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: parseInt(limit) }
    ];

    const mostSoldProducts = await Order.aggregate(pipeline);

    // Totaux globaux
    const totalStats = await Order.aggregate([
      { $match: { paymentStatus: 'paid', 'items.product': { $in: productIds } } },
      { $unwind: "$items" },
      { $match: { 'items.product': { $in: productIds } } },
      {
        $group: {
          _id: { orderId: "$_id", productId: "$items.product" },
          quantity: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
        }
      },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
          totalRevenue: { $sum: "$revenue" }
        }
      }
    ]);

    const globalStats = totalStats[0] || { totalQuantity: 0, totalRevenue: 0 };

    const productsWithPercentages = mostSoldProducts.map(p => ({
      ...p,
      quantityPercentage: globalStats.totalQuantity
        ? Math.round((p.totalQuantitySold / globalStats.totalQuantity) * 100 * 100) / 100
        : 0,
      revenuePercentage: globalStats.totalRevenue
        ? Math.round((p.totalRevenue / globalStats.totalRevenue) * 100 * 100) / 100
        : 0
    }));

    res.status(200).json({
      mostSoldProducts: productsWithPercentages,
      totalQuantitySold: globalStats.totalQuantity,
      totalRevenue: Math.round(globalStats.totalRevenue),
      topProductsCount: mostSoldProducts.length
    });

  } catch (error) {
    console.error('Erreur dans getMostSoldProducts:', error);
    res.status(500).json({
      message: "Erreur lors de la récupération des produits les plus vendus",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

  // ... rest of your code
};

module.exports = statsController;