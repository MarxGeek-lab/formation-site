const { PointConfiguration, DEFAULT_POINTS } = require('../models/PointConfiguration');

const pointConfigurationController = {
  // Initialiser les configurations par défaut
  async initializeDefaultConfigurations(req, res) {
    try {
      const configurations = [];

      for (const [category, actions] of Object.entries(DEFAULT_POINTS)) {
        for (const [action, points] of Object.entries(actions)) {
          configurations.push({
            category,
            action,
            displayName: action.toLowerCase().replace(/_/g, ' '),
            points,
            createdBy: req.user._id
          });
        }
      }

      // Insérer les configurations par défaut dans la base de données
      await PointConfiguration.insertMany(configurations);
      res.status(201).json({ message: 'Configurations par défaut initialisées' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Créer une nouvelle configuration
  async createConfiguration(req, res) {
    try {
      // Créer une nouvelle instance de PointConfiguration avec les données de la requête
      const config = new PointConfiguration({
        ...req.body,
        createdBy: req.user._id
      });
      // Sauvegarder la nouvelle configuration dans la base de données
      await config.save();
      res.status(201).json(config);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Obtenir toutes les configurations
  async getAllConfigurations(req, res) {
    try {
      // Récupérer toutes les configurations et les trier par catégorie et action
      const configs = await PointConfiguration.find()
        .sort({ category: 1, action: 1 });
      res.json(configs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir les configurations par catégorie
  async getConfigurationsByCategory(req, res) {
    try {
      // Récupérer les configurations actives pour une catégorie spécifique
      const configs = await PointConfiguration.find({
        category: req.params.category,
        isActive: true
      });
      res.json(configs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Mettre à jour une configuration
  async updateConfiguration(req, res) {
    try {
      // Mettre à jour une configuration existante avec les nouvelles données
      const config = await PointConfiguration.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          updatedBy: req.user._id,
          updatedAt: new Date()
        },
        { new: true }
      );
      res.json(config);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Activer/désactiver une configuration
  async toggleConfiguration(req, res) {
    try {
      // Récupérer la configuration par ID et inverser son statut actif
      const config = await PointConfiguration.findById(req.params.id);
      config.isActive = !config.isActive;
      config.updatedBy = req.user._id;
      config.updatedAt = new Date();
      // Sauvegarder la configuration mise à jour
      await config.save();
      res.json(config);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Vérifier l'éligibilité aux points
  async checkPointsEligibility(req, res) {
    try {
      const { action, userId, data } = req.body;

      // Rechercher la configuration active pour l'action spécifiée
      const config = await PointConfiguration.findOne({
        action,
        isActive: true
      });

      if (!config) {
        return res.json({ 
          eligible: false, 
          reason: 'Configuration non trouvée' 
        });
      }

      // Vérifier les conditions d'éligibilité
      let eligible = true;
      let reason = '';

      if (config.conditions) {
        if (config.conditions.minAmount && data.amount < config.conditions.minAmount) {
          eligible = false;
          reason = 'Montant minimum non atteint';
        }
        // Ajouter d'autres vérifications selon les conditions
      }

      res.json({
        eligible,
        reason,
        points: eligible ? config.points : 0,
        configuration: eligible ? config : null
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir les statistiques d'attribution
  async getPointsStats(req, res) {
    try {
      // Agréger les données pour obtenir les statistiques d'attribution de points
      const stats = await PointConfiguration.aggregate([
        {
          $lookup: {
            from: 'userrewards',
            localField: 'action',
            foreignField: 'pointsHistory.action',
            as: 'usage'
          }
        },
        {
          $project: {
            category: 1,
            action: 1,
            points: 1,
            usageCount: { $size: '$usage' },
            totalPointsAwarded: {
              $multiply: ['$points', { $size: '$usage' }]
            }
          }
        },
        {
          $group: {
            _id: '$category',
            totalActions: { $sum: 1 },
            totalUsage: { $sum: '$usageCount' },
            totalPoints: { $sum: '$totalPointsAwarded' }
          }
        }
      ]);

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = pointConfigurationController; 