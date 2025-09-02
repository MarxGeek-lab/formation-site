const UserBalance = require('../../models/UserBalance');
const FinancialConfig = require('../../models/FinancialConfig');
const Transaction = require('../../models/Transaction');

const balanceController = {
  // Obtenir tous les soldes utilisateurs
  async getAllBalances(req, res) {
    try {
      const balances = await UserBalance.find()
        .populate('user', 'firstName lastName email')
        .sort({ currentBalance: -1 });

      res.json(balances);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir les demandes de retrait en attente
  async getPendingWithdrawals(req, res) {
    try {
      const balances = await UserBalance.find({
        'withdrawalRequests.status': 'PENDING'
      })
        .populate('user', 'firstName lastName email')
        .select('withdrawalRequests bankDetails user currentBalance');

      const pendingWithdrawals = balances.flatMap(balance => 
        balance.withdrawalRequests
          .filter(request => request.status === 'PENDING')
          .map(request => ({
            ...request.toObject(),
            user: balance.user,
            currentBalance: balance.currentBalance,
            bankDetails: balance.bankDetails
          }))
      );

      res.json(pendingWithdrawals);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Traiter une demande de retrait
  async processWithdrawal(req, res) {
    try {
      const { userId, withdrawalId, status, reason } = req.body;

      const userBalance = await UserBalance.findOne({ user: userId });
      if (!userBalance) {
        return res.status(404).json({ message: 'Solde utilisateur non trouvé' });
      }

      const withdrawalRequest = userBalance.withdrawalRequests.id(withdrawalId);
      if (!withdrawalRequest) {
        return res.status(404).json({ message: 'Demande de retrait non trouvée' });
      }

      withdrawalRequest.status = status;
      withdrawalRequest.processedBy = req.user._id;
      withdrawalRequest.processedAt = new Date();

      if (status === 'COMPLETED') {
        // Ajouter une transaction à l'historique
        await userBalance.addTransaction({
          type: 'WITHDRAWAL',
          amount: withdrawalRequest.amount,
          description: 'Retrait traité',
          status: 'COMPLETED'
        });
      }

      await userBalance.save();

      res.json({
        message: 'Demande de retrait traitée',
        withdrawal: withdrawalRequest
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir les statistiques financières
  async getFinancialStats(req, res) {
    try {
      const { startDate, endDate } = req.query;

      const dateFilter = {};
      if (startDate && endDate) {
        dateFilter.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      // Statistiques des transactions
      const transactionStats = await Transaction.aggregate([
        { $match: { ...dateFilter, status: 'COMPLETED' } },
        {
          $group: {
            _id: null,
            totalTransactions: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
            totalCommissions: { $sum: '$commission.amount' },
            averageCommission: { $avg: '$commission.amount' }
          }
        }
      ]);

      // Statistiques des retraits
      const withdrawalStats = await UserBalance.aggregate([
        { $unwind: '$withdrawalRequests' },
        {
          $match: {
            'withdrawalRequests.status': 'COMPLETED',
            'withdrawalRequests.processedAt': dateFilter.createdAt
          }
        },
        {
          $group: {
            _id: null,
            totalWithdrawals: { $sum: 1 },
            totalWithdrawnAmount: { $sum: '$withdrawalRequests.amount' }
          }
        }
      ]);

      res.json({
        transactions: transactionStats[0] || {
          totalTransactions: 0,
          totalAmount: 0,
          totalCommissions: 0,
          averageCommission: 0
        },
        withdrawals: withdrawalStats[0] || {
          totalWithdrawals: 0,
          totalWithdrawnAmount: 0
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Ajuster manuellement un solde utilisateur
  async adjustBalance(req, res) {
    try {
      const { userId, amount, reason, type } = req.body;

      const userBalance = await UserBalance.findOne({ user: userId });
      if (!userBalance) {
        return res.status(404).json({ message: 'Solde utilisateur non trouvé' });
      }

      await userBalance.addTransaction({
        type: 'ADJUSTMENT',
        amount,
        description: reason,
        status: 'COMPLETED'
      });

      if (type === 'CREDIT') {
        userBalance.currentBalance += amount;
      } else if (type === 'DEBIT') {
        userBalance.currentBalance -= amount;
      }

      await userBalance.save();

      res.json({
        message: 'Solde ajusté avec succès',
        balance: userBalance
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = balanceController; 