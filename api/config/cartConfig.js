module.exports = {
  // Configuration des paniers
  cart: {
    // Durée avant qu'un panier soit considéré comme abandonné (en heures)
    abandonmentThreshold: 12,
    
    // Durée de conservation des paniers abandonnés (en jours)
    cleanupAfterDays: 30,
    
    // Nombre maximum d'articles par panier
    maxItems: 50,
    
    // Prix maximum par panier (en euros)
    maxTotalPrice: 10000,
    
    // Durée de validité d'un panier (en jours)
    cartExpirationDays: 90
  },
  
  // Configuration des emails de relance
  email: {
    // Délai avant envoi du premier email de relance (en heures)
    firstReminderDelay: 2,
    
    // Délai avant envoi du second email de relance (en jours)
    secondReminderDelay: 3,
    
    // Nombre maximum d'emails de relance par panier
    maxReminders: 2,
    
    // Templates d'emails
    templates: {
      abandonedCart: {
        subject: 'Vous avez oublié quelque chose dans votre panier ! 🛒',
        from: process.env.EMAIL_FROM || 'noreply@rafly.com',
        fromName: 'MarxGeek Academy'
      },
      followUp: {
        subject: 'Dernière chance ! Votre panier vous attend 💔',
        from: process.env.EMAIL_FROM || 'noreply@rafly.com',
        fromName: 'MarxGeek Academy'
      }
    }
  },
  
  // Configuration des tâches cron
  cron: {
    // Détection des paniers abandonnés (format cron)
    abandonmentDetection: '0 * * * *', // Toutes les heures
    
    // Envoi des emails de relance (format cron)
    emailReminders: '0 */4 * * *', // Toutes les 4 heures
    
    // Nettoyage des anciens paniers (format cron)
    cleanup: '0 2 * * *', // Tous les jours à 2h du matin
    
    // Activation/désactivation des tâches cron
    enabled: true
  },
  
  // Configuration de la base de données
  database: {
    // Options de connexion MongoDB spécifiques aux paniers
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },
  
  // Configuration des logs
  logging: {
    // Niveau de log pour les opérations de panier
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    
    // Logs des opérations de panier
    logCartOperations: true,
    
    // Logs des emails envoyés
    logEmailSending: true,
    
    // Logs des tâches cron
    logCronJobs: true
  },
  
  // Configuration de sécurité
  security: {
    // Validation des données d'entrée
    validateInput: true,
    
    // Limitation du taux de requêtes par IP
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // Limite à 100 requêtes par fenêtre par IP
    },
    
    // Chiffrement des données sensibles
    encryption: {
      enabled: process.env.NODE_ENV === 'production',
      algorithm: 'aes-256-gcm'
    }
  },
  
  // URLs et liens
  urls: {
    // URL de base du frontend
    frontend: process.env.FRONTEND_URL || 'https://rafly.com',
    
    // URL de restauration de panier
    cartRestore: '/panier?restore=',
    
    // URL de désabonnement
    unsubscribe: '/unsubscribe?email=',
    
    // URL des conditions d'utilisation
    terms: '/conditions',
    
    // URL de politique de confidentialité
    privacy: '/confidentialite'
  }
};
