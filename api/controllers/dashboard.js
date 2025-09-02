const User = require('../models/User');
const Product = require('../models/Product');
const Transaction = require('../models/Transactions');
const Reservation = require('../models/Reservation');

// Obtenir les statistiques générales
const getDashboardStats = async (req, res) => {
    try {
        // Statistiques des utilisateurs
        const totalUsers = await User.countDocuments({ isDeleted: false });
        const totalOwners = await User.countDocuments({ roles: "owner", isDeleted: false });
        const totalTenants = await User.countDocuments({ roles: "tenant", isDeleted: false });
        const totalAgents = await User.countDocuments({ roles: "propertyAgent", isDeleted: false });

        // Statistiques des propriétés
        const totalProperties = await Product.countDocuments({ isDeleted: false });
        const availableProperties = await Product.countDocuments({ state: 'available', isDeleted: false });
        const reservedProperties = await Product.countDocuments({ state: 'reserved', isDeleted: false });
        const soldProperties = await Product.countDocuments({ state: 'sold', isDeleted: false });

        // Statistiques des transactions
        const totalTransactions = await Transaction.countDocuments();
        const successfulTransactions = await Transaction.countDocuments({ status: 'success' });
        const pendingTransactions = await Transaction.countDocuments({ status: 'pending' });
        
        // Calcul des revenus
        const revenues = await Transaction.aggregate([
            { $match: { status: 'success' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const platformCommission = await Transaction.aggregate([
            { $match: { status: 'success' } },
            { $group: { _id: null, total: { $sum: '$platformCommission' } } }
        ]);

        // Statistiques des réservations
        const activeReservations = await Reservation.countDocuments({ status: 'confirmed' });
        const pendingReservations = await Reservation.countDocuments({ status: 'pending' });
        const cancelledReservations = await Reservation.countDocuments({ status: 'cancelled' });

        return res.status(200).json({
            users: {
                total: totalUsers,
                owners: totalOwners,
                tenants: totalTenants,
                agents: totalAgents
            },
            properties: {
                total: totalProperties,
                available: availableProperties,
                reserved: reservedProperties,
                sold: soldProperties
            },
            transactions: {
                total: totalTransactions,
                successful: successfulTransactions,
                pending: pendingTransactions,
                totalRevenue: revenues.length > 0 ? revenues[0].total : 0,
                platformCommission: platformCommission.length > 0 ? platformCommission[0].total : 0
            },
            reservations: {
                active: activeReservations,
                pending: pendingReservations
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// Obtenir les données pour les graphiques
const getChartData = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Les dates de début et de fin sont requises' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        // Données des transactions entre les dates de début et de fin
        const transactionStats = await Transaction.aggregate([
            {
                $match: {
                    transactionDate: {
                        $gte: start,
                        $lte: end
                    }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$transactionDate' },
                        year: { $year: '$transactionDate' }
                    },
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Données des réservations entre les dates de début et de fin
        const reservationStats = await Reservation.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: start,
                        $lte: end
                    }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Données des réservations réussies entre les dates de début et de fin
        const successfulReservationStats = await Reservation.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: start,
                        $lte: end
                    },
                    status: 'confirmed'
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        return res.status(200).json({
            transactions: transactionStats,
            reservations: reservationStats,
            successfulReservations: successfulReservationStats
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des données des graphiques:', error);
        return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getChartData
};