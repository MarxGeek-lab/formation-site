const Customers = require("../models/Customers");
const Order = require("../models/Order");
const Rental = require("../models/Rental");
const Reservation = require("../models/Reservation");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

const customerController = {
    getCustomerByOwner: async (req, res) => {
        try {
            const customers = await User.find({});

            // Récupérer le nombre de réservations pour chaque client
            const customersWithOrders = await Promise.all(customers.map(async (customer) => {
                const ordersCount = await Order.countDocuments({
                    customer: customer._id,
                });
                
                return {
                    ...customer.toObject(),
                    ordersCount: ordersCount
                };
            }));
            
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

    getCustomerData: async (req, res) => {
        try {
            const { id, ownerId } = req.params;
            console.log(req.params);
    
            // Vérifier si l'utilisateur existe
            const customer = await User.findById(id);
            if (!customer) {
                return res.status(404).json({ message: "Client non trouvé." });
            }
            
            const [rental, reservation] = await Promise.all([
                Rental.find({ tenant: id, owner: ownerId }).populate('property'),
                Reservation.find({ tenant: id, owner: ownerId }).populate('property'),
            ])

            const result = [...rental, ...reservation];
            const sortedResult = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            return res.status(200).json(sortedResult);
        } catch (error) {
            console.error("Erreur lors de la récupération du client :", error);
            return res.status(500).json({ message: "Erreur serveur", error });
        }
    }
}

module.exports = customerController;