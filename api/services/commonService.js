const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Withdrawal = require("../models/Withdrawal");

const commonService = {
    async checkBalance (user, type = "owner") {
        try {
            if (type === "owner") {
                await this.updateBalanceOwner(user._id);
            } else {
                await this.updateBalanceTenant(user._id);
            }

            const balanceAvailable = await User.findById(user._id); 
            let withdrawableAmount = balanceAvailable.balance.owner.total - balanceAvailable.balance.owner.withdrawn;

            if (type === "tenant") {
                withdrawableAmount = balanceAvailable.balance.tenant.total - balanceAvailable.balance.tenant.withdrawn;
            }
            
            return withdrawableAmount
        } catch (error) {
            console.log(error)
        }
    },

    async updateBalanceTenant (tenantId) {
        try {
            const tenant = await User.findById(tenantId);
            if (tenant) {
                // Calculer le montant total des transactions d'annulation
                const transactions = await Transaction.find({
                    buyer: tenantId,
                    type: { $in: ['RefundCancelation', 'refundCancelation']},
                    balanceImpact: 'credit',
                    isRefundTransaction: true,
                    status: 'success'
                });
          
                // Calculer la somme des montants de toutes les transactions
                const balanceTotal = transactions.reduce((total, transaction) => {
                    return total + Number(transaction.amount);
                }, 0);
    
                const balanceWithdrawn = withdrawals.reduce((total, withdrawal) => {
                    return total + Number(withdrawal.amount);
                }, 0);
                
                tenant.balance.tenant.total = balanceTotal;
                tenant.balance.tenant.withdrawn = balanceWithdrawn;
                await tenant.save();
            }

            console.log('balance updated')
        } catch (error) {
            console.log('updated balance error : ',error)
        }
    },

    async updateBalanceOwner (ownerId) {
        try {
            const owner = await User.findById(ownerId);
            if (owner) {
                const transactionsPayment = await Transaction.find({
                    seller: ownerId,
                    type: { $in: ['Payment', 'RefundCancelation', 'refundCancelation']},
                    status: 'success',
                    withdrawable: true,
                    balanceImpact: 'credit',
                    isRefundTransaction: false
                }); 

                const transactionsWithdrawn = await Withdrawal.find({
                    user: ownerId,
                    status: 'paid',
                });

                // Calculer la somme des montants de toutes les transactions
                const balanceTotalPayment = transactionsPayment.reduce((total, transaction) => {
                return total + Number(transaction.amount);
                }, 0);
    
                const balanceWithdrawn = transactionsWithdrawn.reduce((total, withdrawal) => {
                return total + Number(withdrawal.amount);
                _}, 0);
                
                owner.balance.owner.total = balanceTotalPayment;
                owner.balance.owner.totalWithdrawn = balanceWithdrawn;
                await owner.save();
            }
            console.log('balance updated')
        } catch (error) {
            console.log('updated balance error : ',error)
        }
    }
}

module.exports = commonService;