const UserReward = require('../models/UserReward');
const rewardService = require('../services/rewardService');

const userRewardController = {
  // Ajouter des points
  async addPoints(req, res) {
    try {
      const { userId, actionCode, points, description } = req.body;
      const userReward = await rewardService.addPointsToUser(
        userId,
        actionCode,
        points,
        description
      );
      res.json(userReward);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir les récompenses d'un utilisateur
  async getUserRewards(req, res) {
    try {
      const userReward = await UserReward.findOne({ user: req.params.userId })
        .populate('referralCode.referrals.referredUser');
      res.json(userReward);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Générer un code de parrainage
  async generateReferralCode(req, res) {
    try {
      let userReward = await UserReward.findOne({ user: req.params.userId });
      if (!userReward) {
        userReward = new UserReward({ user: req.params.userId });
      }
      
      userReward.referralCode.code = rewardService.generateReferralCode();
      await userReward.save();
      
      res.json({ code: userReward.referralCode.code });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = userRewardController; 