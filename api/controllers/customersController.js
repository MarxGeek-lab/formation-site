const Customers = require("../models/Customers");
const Order = require("../models/Order");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

const customerController = {
    getCustomerByOwner: async (req, res) => {
        try {
            let customers;
            let customersWithOrders;

            // Si l'utilisateur est super_admin, il voit tous les clients
            if (req?.user?.role === 'super_admin') {
                customers = await User.find({});

                // Récupérer le nombre de commandes pour chaque client
                customersWithOrders = await Promise.all(customers.map(async (customer) => {
                    const ordersCount = await Order.countDocuments({
                        customer: customer._id,
                    });
                    
                    return {
                        ...customer.toObject(),
                        ordersCount: ordersCount
                    };
                }));
            }
            // Si l'utilisateur est admin, il ne voit que les clients ayant commandé ses produits
            else if (req?.user?.role === 'admin') {
                const adminId = req?.user?._id;
                
                // Récupérer les produits assignés à cet admin
                const Product = require('../models/Product');
                const adminProducts = await Product.find({ assignedAdminId: adminId }).select('_id');
                const productIds = adminProducts.map(product => product._id);

                // Récupérer les commandes contenant les produits de cet admin
                const adminOrders = await Order.find({
                    'items.product': { $in: productIds }
                }).populate('customer');

                // Extraire les clients uniques de ces commandes
                const customerIds = [...new Set(adminOrders.map(order => order.customer._id.toString()))];
                customers = await User.find({ _id: { $in: customerIds } });

                // Récupérer le nombre de commandes pour chaque client (seulement celles contenant les produits de l'admin)
                customersWithOrders = await Promise.all(customers.map(async (customer) => {
                    const ordersCount = await Order.countDocuments({
                        customer: customer._id,
                        'items.product': { $in: productIds }
                    });
                    
                    return {
                        ...customer.toObject(),
                        ordersCount: ordersCount
                    };
                }));
            } else {
                // Si le rôle n'est ni super_admin ni admin
                return res.status(403).json({ 
                    success: false,
                    message: "Accès non autorisé" 
                });
            }
            
            return res.status(200).json(customersWithOrders);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    },

    getCustomerById: async (req, res) => {
        try {
            const { id } = req.params;
    
            // Vérifier si l'utilisateur existe
            const customer = await User.findById(id);
            if (!customer) {
                return res.status(404).json({ message: "Client non trouvé." });
            }
    
            // Récupérer les statistiques
            const [ordersCount, ordersCompleted, ordersPending, ordersCancelled, ordersDelivered, ordersConfirmed] = await Promise.all([
                Order.countDocuments({ tenant: id }),
                Order.countDocuments({ tenant: id, status: 'completed' }),
                Order.countDocuments({ tenant: id, status: 'pending' }),
                Order.countDocuments({ tenant: id, status: 'cancelled' }),
                Order.countDocuments({ tenant: id, status: 'delivered' }),
                Order.countDocuments({ tenant: id, status: 'confirmed' })
            ]);

            const  ordersList = await Order.find({ customer: id })
            .populate('items.product');

            const  payments = await Transaction.find({ customer: id });

            // Calcul des dépenses totales sur les locations
            const totalOrdersSpent = await Order.aggregate([
                { $match: { tenant: id, statusPayment: 'paid' } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } }
            ]);
    
            const customersData = {
                totalOrders: ordersCount,
                completedOrders: ordersCompleted,
                pendingOrders: ordersPending,
                cancelledOrders: ordersCancelled,
                deliveredOrders: ordersDelivered,
                confirmedOrders: ordersConfirmed,
                totalSpent: totalOrdersSpent[0]?.total || 0,
                ordersList: ordersList,
                customer: customer,
                payments: payments
            };
    
            return res.status(200).json(customersData);
        } catch (error) {
            console.error("Erreur lors de la récupération du client :", error);
            return res.status(500).json({ message: "Erreur serveur", error });
        }
    },
}

module.exports = customerController;