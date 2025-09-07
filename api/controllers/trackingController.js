const TrackingEvent = require('../models/TrackingEvent');
const { v4: uuidv4 } = require('uuid');

// Fonction pour détecter le type d'appareil
const detectDevice = (userAgent) => {
  if (!userAgent) return 'unknown';
  
  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'tablet';
  } else {
    return 'desktop';
  }
};

// Fonction pour détecter le navigateur
const detectBrowser = (userAgent) => {
  if (!userAgent) return 'unknown';
  
  const ua = userAgent.toLowerCase();
  if (ua.includes('chrome')) return 'chrome';
  if (ua.includes('firefox')) return 'firefox';
  if (ua.includes('safari')) return 'safari';
  if (ua.includes('edge')) return 'edge';
  if (ua.includes('opera')) return 'opera';
  return 'unknown';
};

// Fonction pour obtenir l'IP réelle du client
const getClientIP = (req) => {
  return req.headers['x-forwarded-for'] || 
         req.headers['x-real-ip'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         '127.0.0.1';
};

class TrackingController {
  // Route pixel pour enregistrer les événements
  static async trackPixel(req, res) {
    try {
      console.log(req.query);
      const { type, productId, orderId, sessionId, userId, value } = req.query;

      // Validation des paramètres requis
      if (!type || !sessionId) {
        return res.status(400).send('Missing required parameters');
      }

      if (!['view', 'add_to_cart', 'purchase'].includes(type)) {
        return res.status(400).send('Invalid event type');
      }

      // Validation spécifique par type d'événement
      if ((type === 'view' || type === 'add_to_cart') && !productId) {
        return res.status(400).send('productId required for view and add_to_cart events');
      }

      if (type === 'purchase' && !orderId) {
        return res.status(400).send('orderId required for purchase events');
      }

      // Collecte des métadonnées
      const userAgent = req.headers['user-agent'];
      const referer = req.headers.referer || req.headers.referrer;
      const ip = getClientIP(req);

      const metadata = {
        ip,
        userAgent,
        referer,
        device: detectDevice(userAgent),
        browser: detectBrowser(userAgent)
      };

      // Création de l'événement de tracking
      const trackingEvent = new TrackingEvent({
        type,
        productId: productId || null,
        orderId: orderId || null,
        userId: userId || null,
        sessionId,
        metadata,
        value: parseFloat(value) || 0
      });

      // Sauvegarde asynchrone pour ne pas ralentir la réponse
      trackingEvent.save().catch(error => {
        console.error('Erreur lors de la sauvegarde de l\'événement de tracking:', error);
      });

      // Retourner une image transparente 1x1 pixel
      const pixelBuffer = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        'base64'
      );

      res.set({
        'Content-Type': 'image/png',
        'Content-Length': pixelBuffer.length,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      res.send(pixelBuffer);

    } catch (error) {
      console.error('Erreur dans trackPixel:', error);
      
      // Même en cas d'erreur, retourner le pixel pour ne pas casser l'affichage
      const pixelBuffer = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        'base64'
      );

      res.set({
        'Content-Type': 'image/png',
        'Content-Length': pixelBuffer.length
      });

      res.send(pixelBuffer);
    }
  }

  // Associer les événements d'une session à un utilisateur
  static async associateSessionToUser(req, res) {
    try {
      console.log("body session == ", req.body);
      const { sessionId, userId } = req.body;

      if (!sessionId || !userId) {
        return res.status(400).json({
          success: false,
          message: 'sessionId et userId sont requis'
        });
      }

      const result = await TrackingEvent.associateSessionToUser(sessionId, userId);

      res.json({
        success: true,
        message: 'Événements associés avec succès',
        modifiedCount: result.modifiedCount
      });

    } catch (error) {
      console.error('Erreur lors de l\'association session-utilisateur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }

  // Obtenir les statistiques de tracking (admin)
  static async getTrackingStats(req, res) {
    try {
      const { 
        startDate, 
        endDate, 
        productId, 
        userId,
        period = '7d' 
      } = req.query;

      // Calcul des dates par défaut
      let start, end;
      if (startDate && endDate) {
        start = new Date(startDate);
        end = new Date(endDate);
      } else {
        end = new Date();
        const days = period === '30d' ? 30 : period === '7d' ? 7 : 1;
        start = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
      }

      // Filtres optionnels
      const filters = {};
      if (productId) filters.productId = productId;
      if (userId) filters.userId = userId;

      // Récupération des statistiques
      const [eventStats, conversionFunnel, topProducts] = await Promise.all([
        TrackingEvent.getEventStats(start, end, filters),
        TrackingEvent.getConversionFunnel(start, end, filters),
        TrackingEvent.getTopProducts(start, end, 'view', 10)
      ]);

      // Formatage des statistiques d'événements
      const formattedEventStats = {
        views: 0,
        addToCarts: 0,
        purchases: 0,
        totalRevenue: 0
      };

      eventStats.forEach(stat => {
        switch (stat._id) {
          case 'view':
            formattedEventStats.views = stat.count;
            break;
          case 'add_to_cart':
            formattedEventStats.addToCarts = stat.count;
            break;
          case 'purchase':
            formattedEventStats.purchases = stat.count;
            formattedEventStats.totalRevenue = stat.totalValue;
            break;
        }
      });

      res.json({
        success: true,
        data: {
          period: { start, end },
          eventStats: formattedEventStats,
          conversionFunnel: conversionFunnel[0] || {
            views: 0,
            addToCarts: 0,
            purchases: 0,
            totalRevenue: 0,
            cartConversionRate: 0,
            purchaseConversionRate: 0,
            checkoutConversionRate: 0
          },
          topProducts
        }
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des stats de tracking:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }

  // Obtenir les événements détaillés (admin)
  static async getTrackingEvents(req, res) {
    try {
      const { 
        page = 1, 
        limit = 50, 
        type, 
        productId, 
        userId,
        sessionId,
        startDate,
        endDate
      } = req.query;

      // Construction de la requête
      const query = {};
      
      if (type) query.type = type;
      if (productId) query.productId = productId;
      if (userId) query.userId = userId;
      if (sessionId) query.sessionId = sessionId;
      
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      // Pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Récupération des événements avec population des références
      const [events, totalCount] = await Promise.all([
        TrackingEvent.find(query)
          .populate('productId', 'name price category')
          .populate('orderId', 'totalAmount status')
          .populate('userId', 'fullName email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        TrackingEvent.countDocuments(query)
      ]);

      res.json({
        success: true,
        data: {
          events,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / parseInt(limit)),
            totalCount,
            limit: parseInt(limit)
          }
        }
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }
}

module.exports = TrackingController;
