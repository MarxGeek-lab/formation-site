const Affiliate = require("../models/Affiliate");
const Payout = require("../models/Payout");
const Referral = require("../models/Referral");
const SiteSettings = require("../models/Settings");
const User = require("../models/User");
const { generateRefCode } = require("../utils/generateRefCode");
const { encryptPassword } = require("../utils/helpers");
require('dotenv').config();

// Create affiliate for a user
const affiliateController = {
    createAffiliateForUser: async (req, res) => {
    try {
        console.log(req.params)
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "User not found" });

        // generate unique refCode
        let refCode = generateRefCode();
        while (await Affiliate.findOne({ refCode })) {
            refCode = generateRefCode();
        }

        const baseUrl = process.env.URL_APP || "https://academy.marxgeek.com.me";
        let affiliate = await Affiliate.findOne({ user: user._id });
        if (!affiliate) {
            const settings = await SiteSettings.findOne();
            affiliate = await Affiliate.create({
                user: user._id,
                refCode,
                referralLink: `${baseUrl}?ref=${refCode}`,
                commissionRate: settings.percentAffiliate,
            });

            await affiliate.save();
        }

        // optionally update user role
        user.isAffiliate = true;
        await user.save();

        res.json({ affiliate });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
    },

    getAffiliateProfile: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ error: "User not found" });
            const affiliate = await Affiliate.findOne({ 
                user: user._id 
            })
            .populate('user')
            .populate('referrals');

            if (!affiliate) return res.status(404).json({ error: "Affiliate not found" });
            res.json(affiliate);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        }
    },

    getReferralsAffiliate: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ error: "User not found" });
            
            const affiliate = await Affiliate.findOne({ 
                user: user._id 
            });
            
            const activities = await Referral.find({ 
                affiliate: affiliate._id 
            });

            res.json(activities);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        }
    },

    createPayoutAffiliate: async (req, res) => {
        try {
            console.log(req.body)
            const { userId } = req.params;
            const { amount, method, country, phone } = req.body;
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ error: "User not found" });
            
            const affiliate = await Affiliate.findOne({ 
                user: user._id 
            });
            
            const payout = await Payout.create({ 
                affiliate: affiliate._id,
                amount,
                method,
                country,
                phone,
                status: "requested",
                requestedAt: Date.now(),
            });

            await payout.save();

            res.status(201).json(payout);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        }
    },

    updatePayoutAffiliate: async (req, res) => {
        try {
            console.log(req.body)
            const { id } = req.params;
            const { amount, method, country, phone } = req.body;
            const payout = await Payout.findById(id);
            if (!payout) return res.status(404).json({ error: "Payout not found" });
            
            if (payout.status !== 'requested') return res.status(400).json({ error: "Payout cannot be updated" });
            
            payout.amount = amount;
            payout.method = method;
            payout.country = country;
            payout.phone = phone;
            await payout.save();

            res.json(payout);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        }
    },

    deletePayoutAffiliate: async (req, res) => {
        try {
            const { id } = req.params;
            const payout = await Payout.findById(id);
            if (!payout) return res.status(404).json({ error: "Payout not found" });
            
            if (payout.status !== 'requested') return res.status(400).json({ error: "Payout cannot be deleted" });
            
            await payout.deleteOne();

            res.json({ message: "Payout deleted successfully" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        }
    },

    getAllPayoutsByAffiliate: async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ error: "User not found" });
            
            const affiliate = await Affiliate.findOne({ 
                user: user._id 
            });
            
            const payouts = await Payout.find({ 
                affiliate: affiliate._id 
            }).sort({requestedAt: -1});
            
            res.json(payouts);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        }
    },

    getPayoutsAffiliate: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ error: "User not found" });
            
            const affiliate = await Affiliate.findOne({ 
                user: user._id 
            });
            
            const payouts = await Payout.find({ 
                affiliate: affiliate._id 
            }).sort({requestedAt: -1});

            res.json(payouts);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        }
    },

    /**
     * 
     * acion admin
     */

    updatePayoutAdmin: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            console.log("== ", req.body)
            const payout = await Payout.findById(id);
            if (!payout) return res.status(404).json({ error: "Payout not found" });
            console.log("== ", payout)
            if (["paid", "rejected"].includes(payout.status)) return res.status(400).json({ error: "Payout cannot be updated" });
            
            payout.status = status;
            await payout.save();

            res.json(payout);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        }
    },

 getAllAffiliates: async (req, res) => {
    try {
        // Récupération des affiliés avec les infos de l'utilisateur
        const affiliates = await Affiliate.find().populate('user');

        // Pour chaque affilié, on peut calculer le nombre de filleuls et le total des gains
        const affiliatesWithDetails = await Promise.all(
            affiliates.map(async (affiliate) => {
                // Nombre de filleuls (supposons qu'ils sont stockés dans la collection User avec referralId)
                const referralsCount = await User.countDocuments({ referredBy: affiliate._id });

                // Total des gains/commissions pour cet affilié (supposons qu'il y a une collection Commission)
                const totalEarningsAggregation = await Referral.aggregate([
                    { $match: { affiliate: affiliate._id, status: "paid" } },
                    { $group: { _id: null, total: { $sum: "$commissionAmount" } } }
                ]);

                const payoutAggregation = await Payout.aggregate([
                    { $match: { affiliate: affiliate._id, status: "paid" } },
                    { $group: { _id: null, total: { $sum: "$amount" } } }
                ]);

                const totalEarnings = totalEarningsAggregation[0]?.total || 0;
                const totalPayout = payoutAggregation[0]?.total || 0;

                return {
                    ...affiliate.toObject(),
                    earnings: totalEarnings,
                    referralsCount,
                    totalPayout
                }
            })
        );

        res.json(affiliatesWithDetails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
},

    getAllPayouts: async (req, res) => {
        try {
            const payouts = await Payout.find()
            .populate({
                path: 'affiliate',
                populate: {
                    path: 'user',
                }
            });
            res.json(payouts);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        }
    },

    getPayoutsByAffiliate: async (req, res) => {
        try {
            const { id } = req.params;
            const payouts = await Payout.find({ affiliate: id });
            res.json(payouts);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        }
    },

    createAffiliate: async (req, res) => {
        try {
            const { name, email, phoneNumber, refCode } = req.body;

            const hashedPassword = await encryptPassword("academy.marxgeek.com@2025");

            let code = refCode
            while (await Affiliate.findOne({ refCode: code })) {
                code = generateRefCode();
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                if (existingUser.isAffiliate) {
                    return res.status(409).json({ error: "User already exists" });
                } else {
                    const affiliate = await Affiliate.create({ 
                        user: existingUser._id, 
                        refCode: code,
                        referralLink: `${process.env.URL_APP || "https://academy.marxgeek.com.me/fr"}?ref=${code}`,
                        commissionRate: 0.1,
                    });
                    await affiliate.save();
                    existingUser.isAffiliate = true;
                    await existingUser.save();
                    return res.status(201).json(affiliate);
                }
            }

            const user = await User.create({ 
                name, 
                email, 
                phoneNumber,
                password: hashedPassword 
            });
            const affiliate = await Affiliate.create({ 
                user: user._id, 
                refCode: code,
                referralLink: `${process.env.URL_APP || "https://academy.marxgeek.com.me/fr"}?ref=${code}`,
                commissionRate: 0.1,
            });
            await affiliate.save();
            user.isAffiliate = true;
            await user.save();
            res.status(201).json(affiliate );
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        }
    },

    getAllActivities: async (req, res) => {
        try {
            const activities = await Referral.find()
            .populate({
                path: 'affiliate',
                populate: {
                    path: 'user',
                }
            })
            .populate('orderId');

            res.json(activities);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        }
    },

    getAllActivitiesByAffiliate: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ error: "User not found" });
            
            const affiliate = await Affiliate.findOne({ 
                user: user._id 
            });
            
            const activities = await Activity.find({ 
                affiliate: affiliate._id 
            });
            
            res.json(activities);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        }
    },

}

module.exports = affiliateController;
