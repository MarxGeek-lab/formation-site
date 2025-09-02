const UserReward = require('../models/UserReward');
const RewardRule = require('../models/RewardRule');

const rewardService = {
  calculateLevel(points) {
    if (points >= 10000) return 'platinum';
    if (points >= 5000) return 'gold';
    if (points >= 2000) return 'silver';
    return 'bronze';
  },

  generateReferralCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  },

  async addPointsToUser(userId, actionCode, points, description) {
    let userReward = await UserReward.findOne({ user: userId });
    if (!userReward) {
      userReward = new UserReward({ user: userId });
    }

    userReward.totalPoints += points;
    userReward.pointsHistory.push({
      action: actionCode,
      points,
      description
    });
    userReward.level = this.calculateLevel(userReward.totalPoints);

    return userReward.save();
  },

  async processReferral(referrerUserId, referredUserId) {
    const referrer = await UserReward.findOne({ user: referrerUserId });
    if (!referrer) return null;

    const referral = {
      referredUser: referredUserId,
      status: 'completed',
      pointsAwarded: true,
      date: new Date()
    };

    referrer.referralCode.referrals.push(referral);
    return referrer.save();
  }
};

module.exports = rewardService; 