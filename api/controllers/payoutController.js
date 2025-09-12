const Payout = require("../models/Payout");
const Affiliate = require("../models/Affiliate");

const payoutController = {
    requestPayoutController: async (req, res) => {
        const affiliateId = req.body.affiliateId; // from auth ideally
        const { amount, method, meta } = req.body;

        try {
            const affiliate = await Affiliate.findById(affiliateId);
            if (!affiliate) return res.status(404).json({ error: "Affiliate not found" });
            if (amount > affiliate.balance) return res.status(400).json({ error: "Insufficient balance" });

            const payout = await Payout.create({
                affiliate: affiliate._id,
                amount,
                method,
                status: "requested",
                meta,
            });

            // reduce affiliate balance (optimistic)
            affiliate.balance -= amount;
            affiliate.paid += amount;
            await affiliate.save();

            // mark related commissions as 'paid' optionally by business logic
            // here we won't auto-mark them; admin processes payouts and marks commissions paid

            return res.json({ payout });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Server error" });
        }
    }
}
module.exports = payoutController;
