// controllers/promoCodeController.js

const PromoCode = require("../models/PromoCode");

const promoController = {
// Créer un nouveau code promo
createPromoCode: async (req, res) => {
    try {
      const promo = new PromoCode(req.body);
      await promo.save();
      res.status(201).json(promo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updatePromoCode: async (req, res) => {
    try {
      const { id } = req.params;
      const promo = await PromoCode.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );
      if (!promo) return res.status(404).json({ message: "Code promo introuvable" });
      res.json({ message: "Code promo mis à jour avec succès", promo });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deletePromoCode: async (req, res) => {
    try {
      const { code } = req.body;
      const promo = await PromoCode.findOneAndDelete({ code: code.toUpperCase() });
      if (!promo) return res.status(404).json({ message: "Code promo introuvable" });
      res.json({ message: "Code promo supprimé avec succès", promo });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  // Vérifier et appliquer un code promo
  applyPromoCode: async (req, res) => {
    try {
      const { code, purchaseAmount } = req.body;
  
      const promo = await PromoCode.findOne({ code: code.toUpperCase(), isActive: true });
  
      if (!promo) {
        return res.status(404).json({ message: "Code promo invalide" });
      }
  
      // Vérifications
      if (promo.expiresAt < new Date()) {
        return res.status(400).json({ message: "Code promo expiré" });
      }
      if (promo.usedCount >= promo.maxUsage) {
        return res.status(400).json({ message: "Code promo déjà utilisé au maximum" });
      }
      if (purchaseAmount < promo.minPurchase) {
        return res.status(400).json({ message: `Montant minimum requis: ${promo.minPurchase}` });
      }
  
      // Calcul réduction
      let discount = 0;
      if (promo.discountType === "percentage") {
        discount = (purchaseAmount * promo.discountValue) / 100;
      } else {
        discount = promo.discountValue;
      }
  
      const finalAmount = purchaseAmount - discount;
  
      res.json({
        message: "Code promo appliqué avec succès",
        discount,
        finalAmount
      });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  // Marquer le code comme utilisé après paiement confirmé
  markPromoAsUsed: async (req, res) => {
    try {
      const { code } = req.body;
  
      const promo = await PromoCode.findOneAndUpdate(
        { code: code.toUpperCase() },
        { $inc: { usedCount: 1 } },
        { new: true }
      );
  
      if (!promo) return res.status(404).json({ message: "Code promo introuvable" });
  
      res.json({ message: "Code promo marqué comme utilisé", promo });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllPromoCodes: async (req, res) => {
    try {
      const promos = await PromoCode.find();
      res.json(promos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPromoCodeById: async (req, res) => {
    try {
      const { id } = req.params;
      const promo = await PromoCode.findById(id);
      if (!promo) return res.status(404).json({ message: "Code promo introuvable" });
      res.json(promo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
}

module.exports = promoController;
