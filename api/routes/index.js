const express = require('express');
const router = express.Router();

const userRoutes = require("./userRoutes");
const productRoutes = require("./productRoutes");
const newsletterRoutes = require("./newsletterRoutes");
const paymentRoutes = require("./paymentRoutes");
// const statsRoutes = require("./statsRoutes");
// const helpCenter = require("./helpCenterRoutes");
// const visitRoutes = require("./visitRoutes");
// const customersRoutes = require("./customerRoutes")
const messagesRoutes = require("./messagesRoutes");
const adminRoutes = require("./adminRoutes");
const subscriptionRoutes = require("./subscriptionRoute");
// const siteSettingsRoutes = require("./siteSettingsRoute");
const categoryRoutes = require("./categoryRoutes");
// const commonRoutes = require("./commonRoutes")
const orderRoutes = require("./orderRoutes")

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/payments', paymentRoutes);
// router.use('/stats', statsRoutes);
// router.use('/helpcenter', helpCenter);
// router.use('/requests', visitRoutes);
// router.use('/customers', customersRoutes);
router.use('/messages', messagesRoutes);

router.use('/admin', adminRoutes);
router.use('/subscription', subscriptionRoutes);
// router.use('/settings', siteSettingsRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
// router.use('/', commonRoutes);

module.exports = router;