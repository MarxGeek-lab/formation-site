// routes/promoCodeRoutes.js
const express = require("express");
const { 
    createPromoCode, 
    applyPromoCode, 
    markPromoAsUsed,
    updatePromoCode,
    deletePromoCode,
    getAllPromoCodes,
    getPromoCodeById
} = require("../controllers/promoCodeController.js");
const auth = require('../middleware/authenticateAdminToken');

const router = express.Router();

router.get("/", auth, getAllPromoCodes);

// Créer un code promo (admin)
router.post("/create", auth, createPromoCode);

// Mettre à jour un code promo (admin)
router.put("/update/:id", auth, updatePromoCode);

// Supprimer un code promo (admin)
router.post("/delete", auth, deletePromoCode);

// Appliquer un code promo (client)
router.post("/apply", applyPromoCode);

// Marquer comme utilisé (après paiement validé)
router.post("/use", auth, markPromoAsUsed);

router.get("/details/:id", auth, getPromoCodeById);

module.exports = router;