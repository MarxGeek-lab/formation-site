const express = require('express');
const router = express.Router();

const userRoutes = require("./userRoutes");
const productRoutes = require("./productRoutes");
const newsletterRoutes = require("./newsletterRoutes");
const reservationRoutes = require("./reservationRoutes");
const rentalRoutes = require("./rentalRoutes");
const purchaseRoutes = require("./purchaseRoutes");
const paymentRoutes = require("./paymentRoutes");
const statsRoutes = require("./statsRoutes");
const helpCenter = require("./helpCenterRoutes");
const visitRoutes = require("./visitRoutes");
const customersRoutes = require("./customerRoutes")
const messagesRoutes = require("./messagesRoutes");
const reviewRoutes = require("./reviewRoutes");
const adminRoutes = require("./adminRoutes");
const siteSettingsRoutes = require("./siteSettingsRoute");
const annonceRoutes = require("./annocesRoute");
const merchantWithdrawalRoutes = require("./merchantWithdrawalRoutes");
const categoryRoutes = require("./categoryRoutes");
const commonRoutes = require("./commonRoutes")
const faqRoutes = require("./faqRoutes");
const orderRoutes = require("./orderRoutes")

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/reservations', reservationRoutes);
router.use('/rental', rentalRoutes);
router.use('/purchase', purchaseRoutes);
router.use('/payments', paymentRoutes);
router.use('/stats', statsRoutes);
router.use('/helpcenter', helpCenter);
router.use('/requests', visitRoutes);
router.use('/customers', customersRoutes);
router.use('/messages', messagesRoutes);
router.use('/reviews', reviewRoutes);
router.use('/faqs', faqRoutes);

router.use('/admin', adminRoutes);
router.use('/annonces', annonceRoutes);
router.use('/withdrawal', merchantWithdrawalRoutes);
router.use('/settings', siteSettingsRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/', commonRoutes);

module.exports = router;