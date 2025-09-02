const RewardRule = require('../models/RewardRule');

const rewardRuleController = {
  // Créer une règle
  async createRule(req, res) {
    try {
      const rule = new RewardRule(req.body);
      await rule.save();
      res.status(201).json(rule);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Obtenir toutes les règles
  async getRules(req, res) {
    try {
      const rules = await RewardRule.find({ isActive: true });
      res.json(rules);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Mettre à jour une règle
  async updateRule(req, res) {
    try {
      const rule = await RewardRule.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(rule);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = rewardRuleController; 