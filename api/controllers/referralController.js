const Affiliate = require("../models/Affiliate");
const Commission = require("../models/Commission");
const Referral = require("../models/Referral");

const referralController = {
  registerReferralClickOrSignup: async (req, res) => {
    // Use to store a signup referral (optional)
    const { refCode, type = "signup", meta } = req.body;

    try {
        const affiliate = await Affiliate.findOne({ refCode });
        if (!affiliate) return res.status(404).json({ error: "Affiliate not found" });

        const referral = await Referral.create({
        affiliate: affiliate._id,
        refCode,
        type,
        status: "pending",
        ...meta && { meta },
    });

    return res.json({ referral });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
},

recordOrderReferral: async (req, res) => {
    const { refCode, orderId, amount } = req.body;

    try {
        const affiliate = await Affiliate.findOne({ refCode });
        if (!affiliate) return res.status(404).json({ error: "Affiliate not found" });

        const commissionAmount = Number((amount * affiliate.commissionRate).toFixed(2));

        const referral = await Referral.create({
            affiliate: affiliate._id,
            refCode,
            type: "order",
            orderId,
            amount,
            commissionAmount,
            status: "converted",
        });

        const commission = await Commission.create({
            affiliate: affiliate._id,
            referral: referral._id,
            amount: commissionAmount,
            paid: false,
        });

        // update affiliate balance
        affiliate.balance += commissionAmount;
        await affiliate.save();

        return res.json({ referral, commission });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Server error" });
        }
    },
}

module.exports = referralController;