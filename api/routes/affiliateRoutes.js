const express = require("express");

const router = express.Router();

const affiliateCtrl = require("../controllers/affiliateController");
const referralCtrl = require("../controllers/referralController");
const adminCtrl = require("../controllers/admin/adminController");
const payoutCtrl = require("../controllers/payoutController");
const auth = require('../middleware/authenticateToken');
const authAdmin = require('../middleware/authenticateAdminToken');

// Affiliate management
router.put("/affiliate/create/:id", affiliateCtrl.createAffiliateForUser);
router.get("/affiliate/profile/:id", auth, affiliateCtrl.getAffiliateProfile);
router.get("/affiliate/referralsList/:id", auth, affiliateCtrl.getReferralsAffiliate);

router.post("/affiliate/payout/:userId", auth, affiliateCtrl.createPayoutAffiliate);
router.put("/affiliate/payout/:id", auth, affiliateCtrl.updatePayoutAffiliate);
router.delete("/affiliate/payout/:id", auth, affiliateCtrl.deletePayoutAffiliate);
router.get("/affiliate/payouts/all/:userId", auth, affiliateCtrl.getAllPayoutsByAffiliate);

// Referral & tracking
router.post("/referral/register", referralCtrl.registerReferralClickOrSignup);
router.post("/referral/order", referralCtrl.recordOrderReferral);

// Payouts
router.post("/payout/request", payoutCtrl.requestPayoutController);

// Admin
router.get("/admin/overview", adminCtrl.adminOverview);
router.post("/admin/affiliates/create", authAdmin, affiliateCtrl.createAffiliate);
router.get("/admin/affiliates", authAdmin, adminCtrl.listAffiliates);
router.get("/admin/affiliates/all", authAdmin, affiliateCtrl.getAllAffiliates);
router.get("/admin/affiliates/payouts/all", authAdmin, affiliateCtrl.getAllPayouts);
router.get("/admin/affiliates/payouts/:id", authAdmin, affiliateCtrl.getPayoutsByAffiliate);
router.put("/admin/affiliates/payout/:id", authAdmin, affiliateCtrl.updatePayoutAdmin);
router.get("/admin/activities/all", authAdmin, affiliateCtrl.getAllActivities);
router.get("/admin/activities/:id", authAdmin, affiliateCtrl.getAllActivitiesByAffiliate);


module.exports = router;
