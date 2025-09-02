const Plan = require('../models/Plan');

const planController = {
  // Obtenir tous les plans
  async getPlans(req, res) {
    try {
      const plans = await Plan.find({ isActive: true });
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Créer un plan
  async createPlan(req, res) {
    try {
      const plan = new Plan(req.body);
      await plan.save();
      res.status(201).json(plan);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Mettre à jour un plan
  async updatePlan(req, res) {
    try {
      const plan = await Plan.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(plan);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Activer ou désactiver un plan
  async togglePlanStatus(req, res) {
    try {
      const plan = await Plan.findById(req.params.id);
      if (!plan) {
        return res.status(404).json({ message: 'Plan non trouvé' });
      }
      plan.isActive = !plan.isActive;
      await plan.save();
      res.json(plan);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = planController; 